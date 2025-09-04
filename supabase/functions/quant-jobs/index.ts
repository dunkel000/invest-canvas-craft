import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'list'

    switch (req.method) {
      case 'GET':
        return await handleGet(action, url, user.id, supabaseClient)
      case 'POST':
        return await handlePost(req, user.id, supabaseClient)
      case 'PUT':
        return await handlePut(req, user.id, supabaseClient)
      case 'DELETE':
        return await handleDelete(url, user.id, supabaseClient)
      default:
        throw new Error('Method not allowed')
    }

  } catch (error) {
    console.error('Error in quant-jobs:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleGet(action: string, url: URL, userId: string, supabaseClient: any) {
  switch (action) {
    case 'list':
      return await listJobs(userId, supabaseClient)
    case 'execute':
      return await executeJob(url.searchParams.get('id'), userId, supabaseClient)
    case 'history':
      return await getJobHistory(url.searchParams.get('id'), userId, supabaseClient)
    default:
      throw new Error('Invalid action')
  }
}

async function handlePost(req: Request, userId: string, supabaseClient: any) {
  const { name, description, notebook_id, cron_expression, parameters = {} } = await req.json()
  
  if (!name || !notebook_id || !cron_expression) {
    throw new Error('Name, notebook_id, and cron_expression are required')
  }

  // Validate cron expression (basic validation)
  if (!isValidCronExpression(cron_expression)) {
    throw new Error('Invalid cron expression')
  }

  // Calculate next run time
  const nextRunAt = calculateNextRun(cron_expression)

  // Create new job
  const { data, error } = await supabaseClient
    .from('quant_jobs')
    .insert({
      user_id: userId,
      notebook_id,
      name,
      description,
      cron_expression,
      parameters,
      next_run_at: nextRunAt.toISOString()
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`)
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handlePut(req: Request, userId: string, supabaseClient: any) {
  const { id, ...updates } = await req.json()
  
  // If updating cron expression, recalculate next run
  if (updates.cron_expression) {
    if (!isValidCronExpression(updates.cron_expression)) {
      throw new Error('Invalid cron expression')
    }
    updates.next_run_at = calculateNextRun(updates.cron_expression).toISOString()
  }

  const { data, error } = await supabaseClient
    .from('quant_jobs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update job: ${error.message}`)
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleDelete(url: URL, userId: string, supabaseClient: any) {
  const id = url.searchParams.get('id')
  
  const { error } = await supabaseClient
    .from('quant_jobs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete job: ${error.message}`)
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function listJobs(userId: string, supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('quant_jobs')
    .select(`
      *,
      quant_notebooks (
        name,
        description
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`)
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function executeJob(jobId: string, userId: string, supabaseClient: any) {
  if (!jobId) {
    throw new Error('Job ID is required')
  }

  // Get job details
  const { data: job, error: jobError } = await supabaseClient
    .from('quant_jobs')
    .select(`
      *,
      quant_notebooks (
        content
      )
    `)
    .eq('id', jobId)
    .eq('user_id', userId)
    .single()

  if (jobError || !job) {
    throw new Error('Job not found')
  }

  if (job.status !== 'active') {
    throw new Error('Job is not active')
  }

  // Get notebook content
  const notebook = job.quant_notebooks
  if (!notebook || !notebook.content) {
    throw new Error('Notebook content not found')
  }

  // Extract code from notebook cells
  const cells = notebook.content.cells || []
  const codeCells = cells.filter((cell: any) => cell.cell_type === 'code')
  const code = codeCells.map((cell: any) => cell.source.join('\n')).join('\n\n')

  if (!code.trim()) {
    throw new Error('No executable code found in notebook')
  }

  // Execute the code by calling quant-execute function
  const executeResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/quant-execute`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code,
      parameters: job.parameters,
      notebook_id: job.notebook_id
    })
  })

  if (!executeResponse.ok) {
    throw new Error('Failed to execute job code')
  }

  const executeResult = await executeResponse.json()

  // Update job with last run info and calculate next run
  const nextRunAt = calculateNextRun(job.cron_expression)
  
  await supabaseClient
    .from('quant_jobs')
    .update({
      last_run_id: executeResult.run_id,
      next_run_at: nextRunAt.toISOString()
    })
    .eq('id', jobId)

  return new Response(JSON.stringify({
    success: true,
    run_id: executeResult.run_id,
    next_run_at: nextRunAt.toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getJobHistory(jobId: string, userId: string, supabaseClient: any) {
  if (!jobId) {
    throw new Error('Job ID is required')
  }

  // Get job to verify ownership
  const { data: job, error: jobError } = await supabaseClient
    .from('quant_jobs')
    .select('id')
    .eq('id', jobId)
    .eq('user_id', userId)
    .single()

  if (jobError || !job) {
    throw new Error('Job not found')
  }

  // Get run history for this job
  const { data: runs, error: runsError } = await supabaseClient
    .from('quant_runs')
    .select('*')
    .eq('notebook_id', jobId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (runsError) {
    throw new Error(`Failed to fetch job history: ${runsError.message}`)
  }

  return new Response(JSON.stringify(runs || []), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function isValidCronExpression(cron: string): boolean {
  // Basic cron validation - 5 parts (minute hour day month weekday)
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) {
    return false
  }

  // More sophisticated validation could be added here
  return true
}

function calculateNextRun(cronExpression: string): Date {
  // Simplified cron parsing - in production, use a proper cron library
  // For now, just add 1 hour to current time as a placeholder
  const now = new Date()
  const nextRun = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
  
  // TODO: Implement proper cron parsing
  // This would parse expressions like "0 9 * * 1-5" (weekdays at 9 AM)
  
  return nextRun
}
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
    console.error('Error in quant-datasets:', error)
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
      return await listDatasets(userId, supabaseClient)
    case 'preview':
      return await previewDataset(url.searchParams.get('id'), userId, supabaseClient)
    case 'schema':
      return await getDatasetSchema(url.searchParams.get('id'), userId, supabaseClient)
    case 'portfolio-data':
      return await getPortfolioData(userId, supabaseClient)
    default:
      throw new Error('Invalid action')
  }
}

async function handlePost(req: Request, userId: string, supabaseClient: any) {
  const { name, description, source_type, source_config } = await req.json()
  
  // Create new dataset
  const { data, error } = await supabaseClient
    .from('quant_datasets')
    .insert({
      user_id: userId,
      name,
      description,
      source_type,
      source_config
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create dataset: ${error.message}`)
  }

  // If it's a portfolio dataset, sync the schema
  if (source_type === 'portfolio') {
    await syncPortfolioSchema(data.id, userId, supabaseClient)
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handlePut(req: Request, userId: string, supabaseClient: any) {
  const { id, ...updates } = await req.json()
  
  const { data, error } = await supabaseClient
    .from('quant_datasets')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update dataset: ${error.message}`)
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleDelete(url: URL, userId: string, supabaseClient: any) {
  const id = url.searchParams.get('id')
  
  const { error } = await supabaseClient
    .from('quant_datasets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete dataset: ${error.message}`)
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function listDatasets(userId: string, supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('quant_datasets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch datasets: ${error.message}`)
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function previewDataset(datasetId: string, userId: string, supabaseClient: any) {
  if (!datasetId) {
    throw new Error('Dataset ID is required')
  }

  // Get dataset info
  const { data: dataset, error: datasetError } = await supabaseClient
    .from('quant_datasets')
    .select('*')
    .eq('id', datasetId)
    .eq('user_id', userId)
    .single()

  if (datasetError || !dataset) {
    throw new Error('Dataset not found')
  }

  let previewData = []

  if (dataset.source_type === 'portfolio') {
    // Get portfolio data preview
    const { data: portfolioData, error: portfolioError } = await supabaseClient
      .rpc('get_user_portfolio_data', { _user_id: userId })

    if (!portfolioError && portfolioData) {
      previewData = portfolioData.slice(0, 100) // Limit to first 100 rows
    }
  }

  return new Response(JSON.stringify({
    dataset,
    preview: previewData,
    row_count: previewData.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getDatasetSchema(datasetId: string, userId: string, supabaseClient: any) {
  if (!datasetId) {
    throw new Error('Dataset ID is required')
  }

  const { data: dataset, error } = await supabaseClient
    .from('quant_datasets')
    .select('schema_info, source_type')
    .eq('id', datasetId)
    .eq('user_id', userId)
    .single()

  if (error || !dataset) {
    throw new Error('Dataset not found')
  }

  return new Response(JSON.stringify(dataset.schema_info || {}), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getPortfolioData(userId: string, supabaseClient: any) {
  // Get user's portfolio data using the function we created
  const { data, error } = await supabaseClient
    .rpc('get_user_portfolio_data', { _user_id: userId })

  if (error) {
    throw new Error(`Failed to fetch portfolio data: ${error.message}`)
  }

  return new Response(JSON.stringify(data || []), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function syncPortfolioSchema(datasetId: string, userId: string, supabaseClient: any) {
  try {
    // Define the schema for portfolio data
    const portfolioSchema = {
      columns: [
        { name: 'portfolio_id', type: 'uuid', description: 'Unique portfolio identifier' },
        { name: 'portfolio_name', type: 'text', description: 'Portfolio name' },
        { name: 'asset_id', type: 'uuid', description: 'Unique asset identifier' },
        { name: 'asset_name', type: 'text', description: 'Asset name' },
        { name: 'asset_symbol', type: 'text', description: 'Asset trading symbol' },
        { name: 'asset_type', type: 'text', description: 'Type of asset (stock, bond, etc.)' },
        { name: 'quantity', type: 'numeric', description: 'Number of units owned' },
        { name: 'current_price', type: 'numeric', description: 'Current price per unit' },
        { name: 'total_value', type: 'numeric', description: 'Total value of position' },
        { name: 'allocation_percentage', type: 'numeric', description: 'Percentage of portfolio' }
      ],
      last_updated: new Date().toISOString()
    }

    // Get row count
    const { data: portfolioData } = await supabaseClient
      .rpc('get_user_portfolio_data', { _user_id: userId })

    const rowCount = portfolioData ? portfolioData.length : 0

    // Update dataset with schema info
    await supabaseClient
      .from('quant_datasets')
      .update({
        schema_info: portfolioSchema,
        row_count: rowCount,
        last_synced: new Date().toISOString()
      })
      .eq('id', datasetId)

  } catch (error) {
    console.error('Error syncing portfolio schema:', error)
  }
}
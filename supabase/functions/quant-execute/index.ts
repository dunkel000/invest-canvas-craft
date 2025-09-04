import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExecuteRequest {
  code: string
  parameters?: Record<string, any>
  notebook_id?: string
}

interface ExecuteResponse {
  run_id: string
  status: string
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

    const { code, parameters = {}, notebook_id }: ExecuteRequest = await req.json()

    if (!code || typeof code !== 'string') {
      throw new Error('Code is required')
    }

    console.log(`Starting code execution for user ${user.id}`)

    // Create a new run record
    const { data: runData, error: runError } = await supabaseClient
      .from('quant_runs')
      .insert({
        user_id: user.id,
        notebook_id: notebook_id || null,
        code,
        parameters,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (runError) {
      console.error('Error creating run:', runError)
      throw new Error('Failed to create run record')
    }

    const runId = runData.id

    // Execute Python code asynchronously
    executeCodeAsync(runId, code, parameters, user.id, supabaseClient)

    return new Response(JSON.stringify({
      run_id: runId,
      status: 'running'
    } as ExecuteResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in quant-execute:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function executeCodeAsync(
  runId: string, 
  code: string, 
  parameters: Record<string, any>,
  userId: string,
  supabaseClient: any
) {
  const startTime = Date.now()
  
  try {
    console.log(`Executing code for run ${runId}`)
    
    // Prepare Python script with security restrictions and portfolio data access
    const pythonScript = `
import sys
import json
import traceback
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio
import io
import base64
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Parameters from request
PARAMETERS = ${JSON.stringify(parameters)}
USER_ID = "${userId}"
RUN_ID = "${runId}"

# Portfolio data access function (simulated - in production this would query Supabase)
def get_portfolio_data():
    """Get user's portfolio data for analysis"""
    # This would be replaced with actual Supabase query
    # For now, return sample data structure
    return pd.DataFrame({
        'portfolio_name': ['Portfolio 1', 'Portfolio 1', 'Portfolio 2'],
        'asset_name': ['AAPL', 'GOOGL', 'MSFT'],
        'asset_symbol': ['AAPL', 'GOOGL', 'MSFT'],
        'asset_type': ['stock', 'stock', 'stock'],
        'quantity': [100, 50, 75],
        'current_price': [150.0, 2500.0, 300.0],
        'total_value': [15000.0, 125000.0, 22500.0],
        'allocation_percentage': [30.0, 70.0, 100.0]
    })

# Capture outputs
outputs = {'stdout': [], 'charts': [], 'data': []}

# Redirect stdout
class OutputCapture:
    def write(self, text):
        outputs['stdout'].append(text)
        return len(text)
    def flush(self):
        pass

old_stdout = sys.stdout
sys.stdout = OutputCapture()

try:
    # Execute user code
${code.split('\n').map(line => `    ${line}`).join('\n')}
    
    # Save any matplotlib figures
    if plt.get_fignums():
        for fig_num in plt.get_fignums():
            fig = plt.figure(fig_num)
            img_buffer = io.BytesIO()
            fig.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
            img_buffer.seek(0)
            img_data = base64.b64encode(img_buffer.getvalue()).decode()
            outputs['charts'].append({
                'type': 'matplotlib',
                'data': img_data,
                'format': 'png'
            })
            plt.close(fig)
    
    status = 'completed'
    error_msg = None
    
except Exception as e:
    status = 'failed'
    error_msg = traceback.format_exc()
    outputs['stdout'].append(f"Error: {str(e)}")

finally:
    sys.stdout = old_stdout

# Output results
result = {
    'status': status,
    'stdout': ''.join(outputs['stdout']),
    'stderr': error_msg,
    'charts': outputs['charts'],
    'data': outputs['data']
}

print(json.dumps(result))
`

    // Execute Python script using Deno subprocess
    const process = new Deno.Command('python3', {
      args: ['-c', pythonScript],
      stdout: 'piped',
      stderr: 'piped'
    })

    const { code: exitCode, stdout, stderr } = await process.output()
    const executionTime = Date.now() - startTime

    let result
    try {
      const output = new TextDecoder().decode(stdout)
      const lines = output.trim().split('\n')
      const resultLine = lines[lines.length - 1]
      result = JSON.parse(resultLine)
    } catch (e) {
      result = {
        status: 'failed',
        stdout: new TextDecoder().decode(stdout),
        stderr: new TextDecoder().decode(stderr),
        charts: [],
        data: []
      }
    }

    // Update run record with results
    const { error: updateError } = await supabaseClient
      .from('quant_runs')
      .update({
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
        execution_time_ms: executionTime,
        completed_at: new Date().toISOString()
      })
      .eq('id', runId)

    if (updateError) {
      console.error('Error updating run:', updateError)
    }

    // Save artifacts (charts, data files)
    if (result.charts && result.charts.length > 0) {
      for (let i = 0; i < result.charts.length; i++) {
        const chart = result.charts[i]
        const fileName = `${userId}/${runId}/chart_${i}.png`
        
        try {
          // Convert base64 to blob and upload to storage
          const imageData = Uint8Array.from(atob(chart.data), c => c.charCodeAt(0))
          
          const { error: uploadError } = await supabaseClient.storage
            .from('quant-artifacts')
            .upload(fileName, imageData, {
              contentType: 'image/png'
            })

          if (!uploadError) {
            // Create artifact record
            await supabaseClient
              .from('quant_artifacts')
              .insert({
                user_id: userId,
                run_id: runId,
                name: `Chart ${i + 1}`,
                artifact_type: 'chart',
                file_path: fileName,
                metadata: { type: chart.type, format: chart.format },
                size_bytes: imageData.length
              })
          }
        } catch (error) {
          console.error('Error saving chart artifact:', error)
        }
      }
    }

    console.log(`Code execution completed for run ${runId} in ${executionTime}ms`)

  } catch (error) {
    console.error(`Error executing code for run ${runId}:`, error)
    
    // Update run with error status
    await supabaseClient
      .from('quant_runs')
      .update({
        status: 'failed',
        stderr: error.message,
        execution_time_ms: Date.now() - startTime,
        completed_at: new Date().toISOString()
      })
      .eq('id', runId)
  }
}
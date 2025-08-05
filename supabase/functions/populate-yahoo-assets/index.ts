import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Popular stocks to populate - S&P 500 top companies
    const symbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B', 'UNH', 'JNJ',
      'LLY', 'V', 'JPM', 'WMT', 'XOM', 'PG', 'MA', 'AVGO', 'HD', 'CVX',
      'MRK', 'ABBV', 'COST', 'PEP', 'KO', 'BAC', 'TMO', 'MCD', 'CSCO', 'ACN',
      'ABT', 'ADBE', 'DHR', 'VZ', 'CRM', 'NFLX', 'ORCL', 'TMUS', 'AMD', 'INTU',
      'WFC', 'CAT', 'QCOM', 'IBM', 'TXN', 'GE', 'AMGN', 'SPGI', 'RTX', 'LOW'
    ];

    const stockData = await Promise.all(symbols.map(async (symbol) => {
      try {
        console.log(`Fetching data for ${symbol}...`);
        
        // Fetch basic quote data
        const quoteResponse = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        );
        
        if (!quoteResponse.ok) {
          throw new Error(`Failed to fetch quote for ${symbol}`);
        }
        
        const quoteData = await quoteResponse.json();
        const result = quoteData.chart.result[0];
        const meta = result.meta;
        
        // Fetch additional company info
        const summaryResponse = await fetch(
          `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryProfile,price`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        );
        
        let companyInfo = {};
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          const quoteSummary = summaryData.quoteSummary.result[0];
          companyInfo = {
            sector: quoteSummary?.summaryProfile?.sector || null,
            industry: quoteSummary?.summaryProfile?.industry || null,
            country: quoteSummary?.summaryProfile?.country || 'US',
            description: quoteSummary?.summaryProfile?.longBusinessSummary || null,
            marketCap: quoteSummary?.price?.marketCap?.raw || null
          };
        }
        
        return {
          symbol,
          name: meta.longName || meta.shortName || symbol,
          asset_type: 'stock',
          current_price: meta.regularMarketPrice || meta.previousClose,
          market_cap: companyInfo.marketCap,
          sector: companyInfo.sector,
          industry: companyInfo.industry,
          country: companyInfo.country,
          exchange: meta.exchangeName || meta.fullExchangeName || 'NASDAQ',
          description: companyInfo.description,
          source: 'yahoo_finance',
          source_id: symbol,
          metadata: {
            currency: meta.currency || 'USD',
            timezone: meta.timezone || 'America/New_York',
            last_updated: new Date().toISOString(),
            yahoo_finance_data: {
              regularMarketPrice: meta.regularMarketPrice,
              previousClose: meta.previousClose,
              fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
              fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh
            }
          },
          is_active: true
        };
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        // Return basic data structure for failed fetches
        return {
          symbol,
          name: symbol,
          asset_type: 'stock',
          current_price: null,
          market_cap: null,
          sector: null,
          industry: null,
          country: 'US',
          exchange: 'NASDAQ',
          description: null,
          source: 'yahoo_finance',
          source_id: symbol,
          metadata: {
            currency: 'USD',
            error: error.message,
            last_updated: new Date().toISOString()
          },
          is_active: true
        };
      }
    }));

    // Filter out any null results and insert into database
    const validStockData = stockData.filter(stock => stock !== null);
    
    console.log(`Inserting ${validStockData.length} stocks into asset universe...`);
    
    // Use upsert to handle duplicates
    const { data, error } = await supabase
      .from('asset_universe')
      .upsert(validStockData, { 
        onConflict: 'symbol,source',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Successfully populated ${data?.length || 0} Yahoo Finance assets`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: data?.length || 0,
        message: `Successfully populated ${data?.length || 0} Yahoo Finance assets`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in populate-yahoo-assets function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})
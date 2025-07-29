import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Top S&P 500 stocks to fetch
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B', 'UNH', 'JNJ'];
    
    const stockData = await Promise.all(symbols.map(async (symbol) => {
      try {
        // Using Yahoo Finance free API
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${symbol}`);
        }
        
        const data = await response.json();
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        
        const currentPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1];
        const previousClose = meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        return {
          symbol,
          name: meta.longName || symbol,
          price: `$${currentPrice.toFixed(2)}`,
          change: `${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
          positive: change >= 0,
          currentPrice,
          previousClose
        };
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        // Return fallback data if API fails
        return {
          symbol,
          name: symbol,
          price: 'N/A',
          change: 'N/A',
          positive: true,
          currentPrice: 0,
          previousClose: 0
        };
      }
    }));

    return new Response(
      JSON.stringify({ data: stockData }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in fetch-sp500 function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
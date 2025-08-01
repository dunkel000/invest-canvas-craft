import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const mockTickers = [
  { symbol: "AAPL", price: 178.45, change: +2.34, changePercent: +1.33 },
  { symbol: "TSLA", price: 245.67, change: -3.21, changePercent: -1.29 },
  { symbol: "MSFT", price: 412.89, change: +5.67, changePercent: +1.39 },
  { symbol: "GOOGL", price: 138.92, change: +1.45, changePercent: +1.05 },
  { symbol: "AMZN", price: 145.23, change: -2.11, changePercent: -1.43 },
  { symbol: "NVDA", price: 789.45, change: +15.67, changePercent: +2.02 },
];

export const TickerTape = () => {
  const [tickerData, setTickerData] = useState(mockTickers);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(ticker => ({
        ...ticker,
        price: ticker.price + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 3
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card/30 border border-border/50 rounded-lg backdrop-blur-sm overflow-hidden">
      <div className="animate-marquee flex items-center space-x-8 py-3 px-4">
        {[...tickerData, ...tickerData].map((ticker, index) => (
          <div key={`${ticker.symbol}-${index}`} className="flex items-center space-x-2 min-w-max">
            <span className="font-semibold text-foreground">{ticker.symbol}</span>
            <span className="text-foreground">${ticker.price.toFixed(2)}</span>
            <div className={`flex items-center space-x-1 ${ticker.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {ticker.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs">
                {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
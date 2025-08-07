import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradingPair {
  pair: string;
  baseToken: string;
  quoteToken: string;
  currentRate: number;
  change24h: number;
  volume24h: number;
}

interface TradingPairCardProps {
  pair: TradingPair;
}

export const TradingPairCard = ({ pair }: TradingPairCardProps) => {
  const isPositive = pair.change24h >= 0;
  
  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-card cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-foreground">{pair.pair}</h3>
            <p className="text-sm text-muted-foreground">
              {pair.baseToken}/{pair.quoteToken}
            </p>
          </div>
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-success" />
          ) : (
            <TrendingDown className="w-5 h-5 text-destructive" />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-semibold text-foreground">
              ${pair.currentRate.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <span
              className={cn(
                "font-semibold",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? "+" : ""}{pair.change24h.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Volume</span>
            <span className="font-semibold text-foreground">
              ${(pair.volume24h / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
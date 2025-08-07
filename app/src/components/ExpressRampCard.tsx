import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Zap } from "lucide-react";
import { useState } from "react";

export const ExpressRampCard = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("ETH");
  const [isFlipped, setIsFlipped] = useState(false);

  const rate = 3250.50; // Mock rate
  const estimatedAmount = parseFloat(amount) / rate || 0;

  const flip = () => {
    setIsFlipped(!isFlipped);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-primary" />
          <span>Express Buy/Sell</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">You Pay</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-background/50 border-border/50"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-24 bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={flip}
              className="bg-primary/10 hover:bg-primary/20 rounded-full"
            >
              <ArrowUpDown className="w-4 h-4 text-primary" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">You Receive</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.00"
                value={estimatedAmount.toFixed(6)}
                readOnly
                className="flex-1 bg-background/30 border-border/50"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-24 bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span className="font-medium">1 {toCurrency} = ${rate.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span className="font-medium">0.5%</span>
          </div>
        </div>

        <Button className="w-full" variant="gradient" size="lg">
          <Zap className="w-4 h-4 mr-2" />
          Buy {toCurrency} Instantly
        </Button>
      </CardContent>
    </Card>
  );
};
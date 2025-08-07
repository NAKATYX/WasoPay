import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Shield, Clock } from "lucide-react";

interface MarketplaceListing {
  listingId: string;
  sellerUsername: string;
  sellerRating: number;
  tradeType: "buy" | "sell";
  token: string;
  amount: number;
  price: number;
  fiatCurrency: string;
  paymentMethods: string[];
  minLimit: number;
  maxLimit: number;
  verified: boolean;
}

interface MarketplaceCardProps {
  listing: MarketplaceListing;
}

export const MarketplaceCard = ({ listing }: MarketplaceCardProps) => {
  const isSellerListing = listing.tradeType === "sell";
  
  return (
    <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {listing.sellerUsername.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{listing.sellerUsername}</span>
                {listing.verified && (
                  <Shield className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span className="text-sm text-muted-foreground">
                  {listing.sellerRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          
          <Badge variant={isSellerListing ? "destructive" : "default"}>
            {isSellerListing ? "SELL" : "BUY"} {listing.token}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-bold text-lg text-foreground">
              {listing.price.toLocaleString()} {listing.fiatCurrency}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Available</span>
            <span className="font-medium text-foreground">
              {listing.amount} {listing.token}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Limits</span>
            <span className="font-medium text-foreground">
              {listing.minLimit.toLocaleString()} - {listing.maxLimit.toLocaleString()} {listing.fiatCurrency}
            </span>
          </div>
          
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Payment Methods</span>
            <div className="flex flex-wrap gap-1">
              {listing.paymentMethods.slice(0, 2).map((method) => (
                <Badge key={method} variant="secondary" className="text-xs">
                  {method}
                </Badge>
              ))}
              {listing.paymentMethods.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{listing.paymentMethods.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <Clock className="w-3 h-3 mr-1" />
            Quick Chat
          </Button>
          
          <Button 
            variant={isSellerListing ? "success" : "crypto"} 
            size="sm" 
            className="flex-1"
          >
            {isSellerListing ? "Buy" : "Sell"} {listing.token}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
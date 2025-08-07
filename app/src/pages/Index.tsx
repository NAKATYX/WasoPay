import { Navigation } from "@/components/Navigation";
import { TradingPairCard } from "@/components/TradingPairCard";
import { StatsCard } from "@/components/StatsCard";
import { ExpressRampCard } from "@/components/ExpressRampCard";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield,
  ArrowRight,
  Zap,
  Star
} from "lucide-react";
import heroImage from "@/assets/hero-crypto.jpg";

// Mock data
const tradingPairs = [
  {
    pair: "ETH/USD",
    baseToken: "ETH",
    quoteToken: "USD",
    currentRate: 3250.50,
    change24h: 5.2,
    volume24h: 2450000000
  },
  {
    pair: "BTC/USD",
    baseToken: "BTC",
    quoteToken: "USD",
    currentRate: 67890.25,
    change24h: -2.1,
    volume24h: 8970000000
  },
  {
    pair: "USDC/USD",
    baseToken: "USDC",
    quoteToken: "USD",
    currentRate: 1.00,
    change24h: 0.01,
    volume24h: 1200000000
  }
];

const marketplaceListings = [
  {
    listingId: "1",
    sellerUsername: "CryptoMaster",
    sellerRating: 4.8,
    tradeType: "sell" as const,
    token: "ETH",
    amount: 5.5,
    price: 3245,
    fiatCurrency: "USD",
    paymentMethods: ["PayPal", "Bank Transfer"],
    minLimit: 100,
    maxLimit: 5000,
    verified: true
  },
  {
    listingId: "2",
    sellerUsername: "BitcoinPro",
    sellerRating: 4.9,
    tradeType: "buy" as const,
    token: "BTC",
    amount: 2.1,
    price: 67950,
    fiatCurrency: "USD",
    paymentMethods: ["Wise", "Revolut", "Cash App"],
    minLimit: 500,
    maxLimit: 10000,
    verified: true
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-crypto opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Trade Crypto
              <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Peer-to-Peer
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              The most secure P2P crypto trading platform with express on/off ramp functionality
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="gradient" size="lg" className="text-lg px-8 py-3">
                <Zap className="w-5 h-5 mr-2" />
                Start Trading
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white/30 text-white hover:bg-white/10">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="24h Volume"
            value="$2.4B"
            change="+12.5%"
            icon={DollarSign}
            trend="up"
          />
          <StatsCard
            title="Active Users"
            value="125K+"
            change="+8.2%"
            icon={Users}
            trend="up"
          />
          <StatsCard
            title="Total Trades"
            value="890K"
            change="+15.1%"
            icon={TrendingUp}
            trend="up"
          />
          <StatsCard
            title="Security Score"
            value="99.9%"
            icon={Shield}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trading Pairs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Trading Pairs</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tradingPairs.map((pair) => (
                  <TradingPairCard key={pair.pair} pair={pair} />
                ))}
              </div>
            </section>

            {/* Marketplace Listings */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">P2P Marketplace</h2>
                <Button variant="ghost" size="sm">
                  Browse All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketplaceListings.map((listing) => (
                  <MarketplaceCard key={listing.listingId} listing={listing} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Express Ramp */}
            <ExpressRampCard />

            {/* Features Card */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Why Choose Waso Pay?</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Secure Escrow</h4>
                      <p className="text-sm text-muted-foreground">Smart contract escrow protection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Express Trading</h4>
                      <p className="text-sm text-muted-foreground">Instant fiat on/off ramps</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Global Network</h4>
                      <p className="text-sm text-muted-foreground">Trade with users worldwide</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default Index;
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  ArrowUpDown, 
  ShoppingBag, 
  Wallet, 
  Zap,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Trade", icon: ArrowUpDown, href: "/trade" },
  { name: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
  { name: "Express", icon: Zap, href: "/express" },
  { name: "Wallet", icon: Wallet, href: "/wallet" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-6 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-crypto rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
              Waso Pay
            </span>
          </div>
          
          <div className="flex space-x-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={activeTab === item.name ? "crypto" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(item.name)}
                className="flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
          <Button variant="gradient" size="sm">
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-crypto rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="text-lg font-bold bg-gradient-crypto bg-clip-text text-transparent">
              Waso Pay
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <Card className="absolute top-16 left-4 right-4 z-50 bg-card/95 backdrop-blur-lg border-border/50">
            <div className="p-4 space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={activeTab === item.name ? "crypto" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              ))}
              <div className="pt-4 space-y-2 border-t border-border/50">
                <Button variant="outline" className="w-full">
                  Connect Wallet
                </Button>
                <Button variant="gradient" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 z-40">
          <div className="flex items-center justify-around p-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "flex flex-col items-center space-y-1 h-auto py-2 px-3",
                  activeTab === item.name && "text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
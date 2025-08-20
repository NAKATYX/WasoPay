import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Zap, ArrowRight, Bitcoin, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/ui/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/p2p" className="text-muted-foreground hover:text-foreground transition-colors">
              Trade
            </Link>
            <Link href="/wallets" className="text-muted-foreground hover:text-foreground transition-colors">
              Wallets
            </Link>
            <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Trusted P2P Platform
          </Badge>

          <h1 className="font-serif font-bold text-4xl md:text-6xl mb-6 text-foreground">
            Trade Crypto with
            <span className="text-primary"> Confidence</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Buy and sell USDT, BTC, and ETH with NGN using your favorite payment methods. Secure escrow, verified
            merchants, and instant settlements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/p2p">
                Start Trading <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4 text-foreground">Why Choose WasoPay?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for P2P traders with security, speed, and simplicity in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">Secure Escrow</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Your funds are protected with multi-signature escrow until both parties confirm the trade
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="font-serif">Verified Merchants</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Trade with KYC-verified merchants with proven track records and high completion rates
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-serif">Instant Settlements</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Fast payments with all major Nigerian banks, OPay, PalmPay, and mobile money
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Cryptocurrencies */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4 text-foreground">Supported Cryptocurrencies</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Trade the most popular cryptocurrencies with competitive rates
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bitcoin className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-2">Bitcoin (BTC)</h3>
                <p className="text-muted-foreground">The original cryptocurrency</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-2">Ethereum (ETH)</h3>
                <p className="text-muted-foreground">Smart contract platform</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-2">Tether (USDT)</h3>
                <p className="text-muted-foreground">Stable digital currency</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4">Ready to Start Trading?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Nigerians already trading crypto safely on WasoPay
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link href="/auth/register">
              Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo />
              </div>
              <p className="text-muted-foreground">Nigeria's most trusted P2P cryptocurrency trading platform</p>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4">Trading</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/p2p" className="hover:text-foreground transition-colors">
                    P2P Market
                  </Link>
                </li>
                <li>
                  <Link href="/p2p/post" className="hover:text-foreground transition-colors">
                    Post Ad
                  </Link>
                </li>
                <li>
                  <Link href="/wallets" className="hover:text-foreground transition-colors">
                    Wallets
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 WasoPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

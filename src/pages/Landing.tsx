import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Zap, Shield, LogIn, GitBranch, Database, Brain, Target, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TickerTape } from "@/components/TickerTape";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Optimization",
      description: "Advanced machine learning algorithms for portfolio optimization and risk assessment."
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Comprehensive dashboards with live market data and performance insights."
    },
    {
      icon: Target,
      title: "Risk Management",
      description: "Sophisticated risk modeling and scenario analysis for informed decision making."
    },
    {
      icon: Layers,
      title: "Multi-Asset Support",
      description: "Support for stocks, bonds, derivatives, crypto, and alternative investments."
    },
    {
      icon: GitBranch,
      title: "Workflow Automation",
      description: "Visual flow designer for automated trading strategies and rebalancing."
    },
    {
      icon: Database,
      title: "Enterprise Integrations",
      description: "Seamless integration with Bloomberg, Reuters, and other institutional data providers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Medusa FinHub
              </h1>
            </div>
            <Link to="/auth">
              <Button className="bg-gradient-primary hover:opacity-90">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 overflow-hidden">
        <ParticlesBackground />
        <div className="relative z-10 text-center space-y-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Medusa FinHub
            </h2>
            <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Professional Investment Platform
            </p>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enterprise-grade portfolio management with AI-powered optimization, real-time analytics, 
              and institutional-level integrations for investment professionals.
            </p>
          </div>
          
          {/* Live Ticker */}
          <div className="max-w-4xl mx-auto">
            <TickerTape />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-4">
                <TrendingUp className="w-5 h-5 mr-2" />
                Start Trading
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <Zap className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">Advanced Portfolio Analytics</h3>
            <p className="text-muted-foreground text-lg">
              Real-time portfolio tracking with sophisticated risk metrics, performance attribution, 
              and AI-powered insights to optimize your investment strategy.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time P&L tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Risk-adjusted returns analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sector allocation optimization</span>
              </div>
            </div>
          </div>
          <PortfolioChart />
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-3xl font-bold">Powerful Features</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage and optimize your investment portfolio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-primary/5 border-primary/20">
          <CardContent className="p-12 text-center space-y-6">
            <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join institutional investors and wealth managers who trust Medusa FinHub for portfolio excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Create Account
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 Medusa FinHub. Built for institutional investment excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
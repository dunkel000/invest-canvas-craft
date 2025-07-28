import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Zap, Shield, LogIn, GitBranch, Database } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Portfolio Analytics",
      description: "Advanced analytics and insights for your investment portfolio with real-time tracking."
    },
    {
      icon: GitBranch,
      title: "Flow Designer",
      description: "Create drag-and-drop workflows to automate your investment strategies and decision making."
    },
    {
      icon: Database,
      title: "API Integrations",
      description: "Connect with external portfolio APIs and sync data from multiple investment platforms."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-grade security with end-to-end encryption to protect your financial data."
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
                Viper Finance Dashboard
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
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Professional Investment Portfolio Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced dark mode admin panel for managing investment portfolios with drag-and-drop flows, 
              API integrations, and comprehensive analytics.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                <TrendingUp className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <Zap className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              Join thousands of investors who trust Viper Finance Dashboard to manage their portfolios
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
            <p>© 2024 Viper Finance Dashboard. Built for professional investors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
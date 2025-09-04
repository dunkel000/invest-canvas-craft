import { DashboardLayout } from "@/components/DashboardLayout"
import { AssetComposer as AssetComposerComponent } from "@/components/AssetComposer"
import ProtectedRoute from "@/components/ProtectedRoute"

const AssetComposerPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Hero Section with Particles */}
        <div className="relative h-48 mb-8 rounded-xl overflow-hidden bg-gradient-to-br from-background via-background/80 to-primary/5 border border-border">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_20%),radial-gradient(circle_at_70%_80%,hsl(var(--primary))_0%,transparent_20%)] opacity-10"></div>
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                >
                  <div 
                    className="w-1 h-1 bg-primary rounded-full opacity-60"
                    style={{
                      boxShadow: '0 0 6px hsl(var(--primary))'
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Compose your own Symphony
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Design and analyze your asset compositions with cashflows and risk assessments
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">          
          <AssetComposerComponent />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AssetComposerPage;
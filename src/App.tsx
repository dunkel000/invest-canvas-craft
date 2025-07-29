import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Assets from "./pages/Assets";
import FlowDesigner from "./pages/FlowDesigner";
import ApiConnections from "./pages/ApiConnections";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Discover from "./pages/Discover";

// Wealth Management Pages
import AllPortfolios from "./pages/wealth/AllPortfolios";
import TaxPlanning from "./pages/wealth/TaxPlanning";
import LiquidityPlanning from "./pages/wealth/LiquidityPlanning";
import FinancialGoals from "./pages/wealth/FinancialGoals";

// Portfolio Pages
import PersonalPortfolio from "./pages/portfolios/PersonalPortfolio";
import ApiSyncedPortfolios from "./pages/portfolios/ApiSyncedPortfolios";
import ManualPortfolios from "./pages/portfolios/ManualPortfolios";
import ClientPortfolios from "./pages/portfolios/ClientPortfolios";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Navigate to="/wealth/all-portfolios" replace />} />
              
              {/* Wealth Management Routes */}
              <Route path="/wealth/all-portfolios" element={<AllPortfolios />} />
              <Route path="/wealth/tax-planning" element={<TaxPlanning />} />
              <Route path="/wealth/liquidity-planning" element={<LiquidityPlanning />} />
              <Route path="/wealth/financial-goals" element={<FinancialGoals />} />
              
              {/* Portfolio Routes */}
              <Route path="/portfolios/personal" element={<PersonalPortfolio />} />
              <Route path="/portfolios/api-synced" element={<ApiSyncedPortfolios />} />
              <Route path="/portfolios/manual" element={<ManualPortfolios />} />
              <Route path="/portfolios/clients" element={<ClientPortfolios />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/assets" element={<div>Asset Management coming soon</div>} />
              <Route path="/admin/analytics" element={<div>System Analytics coming soon</div>} />
              <Route path="/admin/settings" element={<div>Admin Settings coming soon</div>} />
              
              {/* Legacy and Other Routes */}
              <Route path="/discover" element={<Discover />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/asset-types" element={<Assets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/asset-composer" element={<FlowDesigner />} />
              <Route path="/api-connections" element={<ApiConnections />} />
              <Route path="/analytics" element={<div>Analytics coming soon</div>} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

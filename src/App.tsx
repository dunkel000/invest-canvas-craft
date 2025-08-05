import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Assets from "./pages/Assets";
import AssetComposer from "./pages/AssetComposer";
import ApiConnections from "./pages/ApiConnections";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Discover from "./pages/Discover";

// Wealth Management Pages
import TaxPlanning from "./pages/wealth/TaxPlanning";
import LiquidityPlanning from "./pages/wealth/LiquidityPlanning";
import FinancialGoals from "./pages/wealth/FinancialGoals";

// Portfolio Pages
import AllPortfolios from "./pages/portfolios/AllPortfolios";
import CustomPortfolio from "./pages/portfolios/CustomPortfolio";
import ApiSyncedPortfolios from "./pages/portfolios/ApiSyncedPortfolios";
import InvestmentTemplates from "./pages/portfolios/InvestmentTemplates";
import ClientPortfolios from "./pages/portfolios/ClientPortfolios";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";

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
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Navigate to="/portfolios/all" replace />} />

              {/* Wealth Management Routes */}
              <Route path="/wealth/tax-planning" element={<TaxPlanning />} />
              <Route path="/wealth/liquidity-planning" element={<LiquidityPlanning />} />
              <Route path="/wealth/financial-goals" element={<FinancialGoals />} />

              {/* Portfolio Routes */}
              <Route path="/portfolios/all" element={<AllPortfolios />} />
              <Route path="/portfolios/personal" element={<CustomPortfolio />} />
              <Route path="/portfolios/manual" element={<CustomPortfolio />} />
              <Route path="/portfolios/custom" element={<CustomPortfolio />} />
              <Route path="/portfolios/investment-templates" element={<InvestmentTemplates />} />
              <Route path="/portfolios/api-synced" element={<ApiSyncedPortfolios />} />
              <Route path="/portfolios/clients" element={<ClientPortfolios />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/settings" element={<SystemSettings />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              
              {/* Legacy and Other Routes */}
              <Route path="/discover" element={<Discover />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/asset-types" element={<Assets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/asset-composer" element={<AssetComposer />} />
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

import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Settings, 
  PieChart, 
  Database,
  GitBranch,
  Wallet,
  LogOut,
  ChevronDown,
  Target,
  Calculator,
  Receipt,
  User,
  Link,
  Briefcase,
  Users,
  Search,
  Crown,
  Shield
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { ProfileAvatar } from "@/components/ProfileAvatar"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
]

const wealthManagementItems = [
  { title: "All Portfolios", url: "/wealth/all-portfolios", icon: PieChart },
  { title: "Tax Planning", url: "/wealth/tax-planning", icon: Receipt },
  { title: "Liquidity Planning", url: "/wealth/liquidity-planning", icon: Calculator },
  { title: "Financial Goals", url: "/wealth/financial-goals", icon: Target },
]

const portfolioItems = [
  { title: "Personal Portfolio", url: "/portfolios/personal", icon: User },
  { title: "API Synced Portfolios", url: "/portfolios/api-synced", icon: Link },
  { title: "Manual Portfolios", url: "/portfolios/manual", icon: Briefcase },
  { title: "Client Portfolios", url: "/portfolios/clients", icon: Users },
]

const otherItems = [
  { title: "Discover", url: "/discover", icon: Search },
  { title: "Asset Types", url: "/asset-types", icon: Layers },
  { title: "Asset Composer", url: "/asset-composer", icon: GitBranch },
  { title: "API Connections", url: "/api-connections", icon: Database },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
]

const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: Crown },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Asset Management", url: "/admin/assets", icon: Database },
  { title: "System Analytics", url: "/admin/analytics", icon: BarChart3 },
]

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const currentPath = location.pathname
  const { signOut, isAdmin } = useAuth()
  const [wealthOpen, setWealthOpen] = useState(true)
  const [portfoliosOpen, setPortfoliosOpen] = useState(true)
  const [adminOpen, setAdminOpen] = useState(true)

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path)
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-green-600 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  const handleSignOut = () => {
    signOut()
  }

  const renderMenuItems = (items: typeof mainItems) => (
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink to={item.url} end className={getNavCls}>
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  )

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className="p-4 border-b border-sidebar-border bg-sidebar">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-green-600">WealthFlow</h2>
              <p className="text-xs text-green-600/60">Wealth Management</p>
            </div>
            <ProfileAvatar />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(mainItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wealth Management Section */}
        <SidebarGroup>
          <Collapsible open={wealthOpen} onOpenChange={setWealthOpen}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="group/collapsible w-full flex items-center justify-between text-sm font-medium text-green-600 hover:bg-sidebar-accent/50 px-2 py-1 rounded-md data-[state=open]:bg-sidebar-accent/30">
                <span>Wealth Management</span>
                <ChevronDown className={`h-4 w-4 transition-transform text-green-600 ${wealthOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(wealthManagementItems)}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Portfolios Section */}
        <SidebarGroup>
          <Collapsible open={portfoliosOpen} onOpenChange={setPortfoliosOpen}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="group/collapsible w-full flex items-center justify-between text-sm font-medium text-green-600 hover:bg-sidebar-accent/50 px-2 py-1 rounded-md data-[state=open]:bg-sidebar-accent/30">
                <span>Portfolios</span>
                <ChevronDown className={`h-4 w-4 transition-transform text-green-600 ${portfoliosOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(portfolioItems)}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Admin Section - Only visible for admins */}
        {isAdmin && (
          <SidebarGroup>
            <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="group/collapsible w-full flex items-center justify-between text-sm font-medium text-green-600 hover:bg-sidebar-accent/50 px-2 py-1 rounded-md data-[state=open]:bg-sidebar-accent/30">
                  <span className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Admin
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform text-green-600 ${adminOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {renderMenuItems(adminItems)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {/* Other Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(otherItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings & Sign Out */}
        <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {renderMenuItems(settingsItems)}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className="text-green-600 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
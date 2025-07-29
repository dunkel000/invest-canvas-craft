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
  Search
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
  { title: "Asset Composer", url: "/flow-designer", icon: GitBranch },
  { title: "API Connections", url: "/api-connections", icon: Database },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const currentPath = location.pathname
  const { signOut } = useAuth()
  const [wealthOpen, setWealthOpen] = useState(true)
  const [portfoliosOpen, setPortfoliosOpen] = useState(true)

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path)
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

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
              <h2 className="text-sm font-semibold text-sidebar-foreground">PortfolioFlow</h2>
              <p className="text-xs text-sidebar-foreground/60">Wealth Management</p>
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
              <CollapsibleTrigger className="group/collapsible w-full flex items-center justify-between text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 px-2 py-1 rounded-md data-[state=open]:bg-sidebar-accent/30">
                <span>Wealth Management</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${wealthOpen ? 'rotate-180' : ''}`} />
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
              <CollapsibleTrigger className="group/collapsible w-full flex items-center justify-between text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 px-2 py-1 rounded-md data-[state=open]:bg-sidebar-accent/30">
                <span>Portfolios</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${portfoliosOpen ? 'rotate-180' : ''}`} />
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

        {/* Other Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(otherItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive">
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
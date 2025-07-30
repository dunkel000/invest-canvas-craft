import { useState, useMemo } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { LogOut, ChevronDown, Wallet, Crown } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useModuleAccess } from "@/hooks/useModuleAccess"
import { ProfileAvatar } from "@/components/ProfileAvatar"

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

interface ModuleItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  moduleId: string;
}

export function AppSidebar() {
  const location = useLocation()
  const currentPath = location.pathname
  const { signOut, isAdmin } = useAuth()
  const { modules, loading } = useModuleAccess()
  
  // State for collapsible sections
  const [adminOpen, setAdminOpen] = useState(true)
  const [wealthOpen, setWealthOpen] = useState(true)
  const [portfoliosOpen, setPortfoliosOpen] = useState(true)
  const [toolsOpen, setToolsOpen] = useState(false)

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path)
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-green-600 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  const handleSignOut = () => {
    signOut()
  }

  // Convert modules to sidebar items with icons
  const moduleItems = useMemo(() => {
    return modules.map(module => {
      const IconComponent = (LucideIcons as any)[module.icon] || LucideIcons.Circle
      return {
        title: module.name,
        url: module.path,
        icon: IconComponent,
        moduleId: module.module_id,
        category: module.category
      }
    })
  }, [modules])

  // Group modules by category
  const modulesByCategory = useMemo(() => {
    const grouped: Record<string, ModuleItem[]> = {}
    moduleItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    return grouped
  }, [moduleItems])

  const renderMenuItems = (items: ModuleItem[]) => (
    items.map((item) => (
      <SidebarMenuItem key={item.moduleId}>
        <SidebarMenuButton asChild>
          <NavLink to={item.url} end className={getNavCls}>
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  )

  if (loading) {
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
                <p className="text-xs text-green-600/60">Loading...</p>
              </div>
              <ProfileAvatar />
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

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

        {/* Admin Section - First for admin users */}
        {isAdmin && modulesByCategory.admin && modulesByCategory.admin.length > 0 && (
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
                    {renderMenuItems(modulesByCategory.admin)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {/* Main Dashboard */}
        {modulesByCategory.main && modulesByCategory.main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {renderMenuItems(modulesByCategory.main)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Wealth Management Section */}
        {modulesByCategory.wealth && modulesByCategory.wealth.length > 0 && (
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
                    {renderMenuItems(modulesByCategory.wealth)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {/* Portfolios Section */}
        {modulesByCategory.portfolios && modulesByCategory.portfolios.length > 0 && (
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
                    {renderMenuItems(modulesByCategory.portfolios)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {/* Tools Section */}
        {modulesByCategory.tools && modulesByCategory.tools.length > 0 && (
          <SidebarGroup>
            <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="group/collapsible w-full flex items-center justify-between text-sm font-medium text-green-600 hover:bg-sidebar-accent/50 px-2 py-1 rounded-md data-[state=open]:bg-sidebar-accent/30">
                  <span>Tools & Analytics</span>
                  <ChevronDown className={`h-4 w-4 transition-transform text-green-600 ${toolsOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {renderMenuItems(modulesByCategory.tools)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {/* Settings & Sign Out */}
        <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {modulesByCategory.settings && renderMenuItems(modulesByCategory.settings)}
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
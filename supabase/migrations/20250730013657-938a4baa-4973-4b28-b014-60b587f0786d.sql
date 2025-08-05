-- Insert default system modules
INSERT INTO public.system_modules (module_id, name, path, icon, category, description, min_role, sort_order) VALUES
-- Admin modules
('admin_dashboard', 'Admin Dashboard', '/admin', 'Crown', 'admin', 'Administrative overview and controls', 'admin', 1),
('user_management', 'User Management', '/admin/users', 'Users', 'admin', 'Manage users and roles', 'admin', 2),
('system_settings', 'System Settings', '/admin/settings', 'Settings', 'admin', 'Configure system-wide settings', 'admin', 3),
('audit_logs', 'Audit Logs', '/admin/audit-logs', 'FileText', 'admin', 'View system audit logs', 'admin', 4),
('system_analytics', 'System Analytics', '/admin/analytics', 'BarChart3', 'admin', 'System performance analytics', 'admin', 5),

-- Main dashboard
('dashboard', 'Dashboard', '/', 'LayoutDashboard', 'main', 'Main dashboard overview', 'standard_user', 10),

-- Wealth management modules
('financial_goals', 'Financial Goals', '/wealth/financial-goals', 'Target', 'wealth', 'Set and track financial goals', 'standard_user', 21),
('liquidity_planning', 'Liquidity Planning', '/wealth/liquidity-planning', 'Droplets', 'wealth', 'Plan cash flow and liquidity', 'premium_user', 22),
('tax_planning', 'Tax Planning', '/wealth/tax-planning', 'Calculator', 'wealth', 'Tax optimization strategies', 'premium_user', 23),

-- Portfolio modules
('all_portfolios', 'All Portfolios', '/portfolios/all', 'Briefcase', 'portfolios', 'View all portfolio summaries', 'standard_user', 20),
('personal_portfolio', 'Custom Portfolio', '/portfolios/custom', 'User', 'portfolios', 'Manage personal investments', 'standard_user', 30),
('investment_templates', 'Investment Templates', '/portfolios/investment-templates', 'Edit', 'portfolios', 'Manually managed portfolios', 'standard_user', 31),
('api_synced_portfolios', 'API Synced Portfolios', '/portfolios/api-synced', 'RefreshCw', 'portfolios', 'Automatically synced portfolios', 'premium_user', 32),
('client_portfolios', 'Client Portfolios', '/portfolios/clients', 'Briefcase', 'portfolios', 'Manage client portfolios', 'investment_professional', 33),

-- Tools modules
('assets', 'Assets', '/assets', 'Coins', 'tools', 'Asset management and universe', 'standard_user', 40),
 ('asset_composer', 'Asset Composer', '/asset-composer', 'Workflow', 'tools', 'Design financial workflows', 'premium_user', 41),
('api_connections', 'API Connections', '/api-connections', 'Plug', 'tools', 'Manage external API connections', 'premium_user', 42),
('discover', 'Discover', '/discover', 'Search', 'tools', 'Discover new assets and opportunities', 'standard_user', 43),

-- Settings
('settings', 'Settings', '/settings', 'Settings', 'settings', 'User account settings', 'standard_user', 50);
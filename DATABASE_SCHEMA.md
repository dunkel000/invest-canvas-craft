# Database Schema

The application uses a Supabase (PostgreSQL) database defined through SQL migrations. Below is an overview of the main tables and their columns.

## profiles
Stores additional user information.
- `id` UUID primary key
- `user_id` UUID references `auth.users`
- `display_name` TEXT
- `avatar_url` TEXT
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250728194440-e4d1d589-4ab6-4e7f-93e6-593e4cad5019.sql†L1-L9】

## portfolios
Represents a user's investment portfolio.
- `id` UUID primary key
- `user_id` UUID references `auth.users`
- `name` TEXT
- `description` TEXT
- `total_value` DECIMAL(15,2) default 0
- `currency` TEXT default 'USD'
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250728194440-e4d1d589-4ab6-4e7f-93e6-593e4cad5019.sql†L11-L21】

## assets
Tracks individual assets within a portfolio.
- `id` UUID primary key
- `portfolio_id` UUID references `portfolios`
- `user_id` UUID references `auth.users`
- `name` TEXT
- `symbol` TEXT
- `asset_type` ENUM `asset_type`
- `quantity` DECIMAL(15,8) default 0
- `purchase_price` DECIMAL(15,2)
- `current_price` DECIMAL(15,2)
- `total_value` DECIMAL(15,2)
- `risk_category` ENUM `risk_category` default 'medium'
- `metadata` JSONB default '{}'
- `api_connection_id` UUID references `api_connections`
- `allocation_percentage` NUMERIC default 0
- `target_allocation_percentage` NUMERIC default 0
- `universe_asset_id` UUID references `asset_universe`
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250728194440-e4d1d589-4ab6-4e7f-93e6-593e4cad5019.sql†L26-L40】【F:supabase/migrations/20250728200934-f2efa668-9be8-483e-8dcf-cddc317631af.sql†L10-L17】【F:supabase/migrations/20250729063226-3ed6adba-4a5f-4a5b-b062-57e1b2749fe7.sql†L49-L52】

## api_connections
External API credentials per user.
- `id` UUID primary key
- `user_id` UUID references `auth.users`
- `name` TEXT
- `provider` TEXT
- `api_key_encrypted` TEXT
- `endpoint_url` TEXT
- `is_active` BOOLEAN default true
- `last_sync` TIMESTAMPTZ
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250728194440-e4d1d589-4ab6-4e7f-93e6-593e4cad5019.sql†L42-L54】

## flows
User-defined drag-and-drop workflows.
- `id` UUID primary key
- `user_id` UUID references `auth.users`
- `name` TEXT
- `description` TEXT
- `flow_data` JSONB default '{}'
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250728194440-e4d1d589-4ab6-4e7f-93e6-593e4cad5019.sql†L56-L65】

## cashflows
Cash movement nodes linked to assets or flows.
- `id` UUID primary key
- `user_id` UUID
- `asset_id` UUID references `assets`
- `flow_id` UUID references `flows`
- `cashflow_type` ENUM `cashflow_type`
- `amount` NUMERIC default 0
- `frequency` TEXT default 'monthly'
- `start_date` TIMESTAMPTZ
- `end_date` TIMESTAMPTZ
- `description` TEXT
- `metadata` JSONB default '{}'
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250728200934-f2efa668-9be8-483e-8dcf-cddc317631af.sql†L19-L34】

## math_functions
Computation nodes within flows.
- `id` UUID primary key
- `user_id` UUID
- `flow_id` UUID references `flows`
- `function_type` ENUM `math_function_type`
- `input_assets` UUID[]
- `parameters` JSONB default '{}'
- `formula` TEXT
- `description` TEXT
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250728200934-f2efa668-9be8-483e-8dcf-cddc317631af.sql†L66-L78】

## asset_universe
Global catalog of available assets.
- `id` UUID primary key
- `symbol` TEXT
- `name` TEXT
- `asset_type` ENUM `asset_type`
- `current_price` NUMERIC
- `market_cap` NUMERIC
- `sector` TEXT
- `industry` TEXT
- `country` TEXT
- `exchange` TEXT
- `description` TEXT
- `source` TEXT default 'manual'
- `source_id` TEXT
- `metadata` JSONB default '{}'
- `is_active` BOOLEAN default true
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`
- unique constraint on (`symbol`, `source`)【F:supabase/migrations/20250729063226-3ed6adba-4a5f-4a5b-b062-57e1b2749fe7.sql†L1-L20】【F:supabase/migrations/20250805123106_aae95077-8765-4b40-8eb5-c2ef5f54f8c5.sql†L1-L6】

## portfolio_performance
Stores daily performance metrics for portfolios.
- `id` UUID primary key
- `portfolio_id` UUID references `portfolios`
- `user_id` UUID
- `date` DATE default current_date
- `total_value` NUMERIC default 0
- `daily_return` NUMERIC default 0
- `daily_return_percentage` NUMERIC default 0
- `created_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250729063226-3ed6adba-4a5f-4a5b-b062-57e1b2749fe7.sql†L60-L70】

## user_roles
User roles for authorization.
- `id` UUID primary key
- `user_id` UUID references `auth.users`
- `role` ENUM `app_role` default 'user'
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`
- unique `(user_id, role)` constraint【F:supabase/migrations/20250729064702-d7a92478-bf74-4793-96a6-19631fc8f853.sql†L1-L12】

## audit_logs
Tracks administrative actions.
- `id` UUID primary key
- `admin_user_id` UUID
- `target_user_id` UUID
- `action` TEXT
- `details` JSONB default '{}'
- `created_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250729190221-670ea904-67e7-4824-9be2-588a0ae04236.sql†L92-L100】

## system_modules
Defines modules available in the system.
- `id` UUID primary key
- `module_id` TEXT unique
- `name` TEXT
- `path` TEXT
- `icon` TEXT
- `category` TEXT
- `description` TEXT
- `min_role` ENUM `app_role` default 'standard_user'
- `requires_subscription` BOOLEAN default false
- `is_active` BOOLEAN default true
- `sort_order` INTEGER default 0
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250730012207-38dc6a82-d949-4fff-936d-12aeb40c7372.sql†L1-L16】

## role_module_permissions
Access control per role and module.
- `id` UUID primary key
- `role` ENUM `app_role`
- `module_id` TEXT
- `is_enabled` BOOLEAN default true
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`
- unique `(role, module_id)` constraint【F:supabase/migrations/20250730012207-38dc6a82-d949-4fff-936d-12aeb40c7372.sql†L18-L27】

## module_settings
Configuration values for modules.
- `id` UUID primary key
- `setting_key` TEXT unique
- `setting_value` JSONB default '{}'
- `description` TEXT
- `created_at` TIMESTAMPTZ default `now()`
- `updated_at` TIMESTAMPTZ default `now()`【F:supabase/migrations/20250730012207-38dc6a82-d949-4fff-936d-12aeb40c7372.sql†L29-L37】


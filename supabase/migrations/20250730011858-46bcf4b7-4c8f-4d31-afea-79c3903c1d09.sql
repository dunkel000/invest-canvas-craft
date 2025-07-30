-- First, extend the existing app_role enum to include all user tiers
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'investment_professional';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'premium_user';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'standard_user';
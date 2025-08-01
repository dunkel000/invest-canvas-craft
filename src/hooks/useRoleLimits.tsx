import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RoleLimits {
  role: string;
  max_portfolios: number;
  max_api_connections: number;
  max_requests_per_day: number;
  features_enabled: any;
  subscription_tier: string;
}

export const useRoleLimits = () => {
  const { user } = useAuth();
  const [limits, setLimits] = useState<RoleLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRoleLimits();
    } else {
      setLimits(null);
      setLoading(false);
    }
  }, [user]);

  const fetchRoleLimits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_role_limits', {
        _user_id: user.id
      });

      if (error) {
        console.error('Error fetching role limits:', error);
        return;
      }

      if (data && data.length > 0) {
        setLimits(data[0]);
      }
    } catch (error) {
      console.error('Error fetching role limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreatePortfolio = (currentCount: number): boolean => {
    if (!limits) return false;
    return limits.max_portfolios === -1 || currentCount < limits.max_portfolios;
  };

  const canCreateApiConnection = (currentCount: number): boolean => {
    if (!limits) return false;
    return limits.max_api_connections === -1 || currentCount < limits.max_api_connections;
  };

  const hasFeature = (featureName: string): boolean => {
    if (!limits) return false;
    return limits.features_enabled[featureName] === true;
  };

  const getRemainingPortfolios = (currentCount: number): number => {
    if (!limits || limits.max_portfolios === -1) return -1;
    return Math.max(0, limits.max_portfolios - currentCount);
  };

  const getRemainingApiConnections = (currentCount: number): number => {
    if (!limits || limits.max_api_connections === -1) return -1;
    return Math.max(0, limits.max_api_connections - currentCount);
  };

  return {
    limits,
    loading,
    canCreatePortfolio,
    canCreateApiConnection,
    hasFeature,
    getRemainingPortfolios,
    getRemainingApiConnections,
    refetch: fetchRoleLimits
  };
};
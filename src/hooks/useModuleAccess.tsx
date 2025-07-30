import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SystemModule {
  module_id: string;
  name: string;
  path: string;
  icon: string;
  category: string;
  description: string;
  sort_order: number;
}

export const useModuleAccess = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserModules();
    } else {
      setModules([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserModules = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_accessible_modules', {
        _user_id: user.id
      });

      if (error) {
        console.error('Error fetching user modules:', error);
        return;
      }

      setModules(data || []);
    } catch (error) {
      console.error('Error fetching user modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessModule = (moduleId: string): boolean => {
    return modules.some(module => module.module_id === moduleId);
  };

  const getModulesByCategory = (category: string): SystemModule[] => {
    return modules.filter(module => module.category === category);
  };

  const getUserModules = (): SystemModule[] => {
    return modules;
  };

  const checkModulePermission = async (moduleId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('check_module_permission', {
        _user_id: user.id,
        _module_id: moduleId
      });

      if (error) {
        console.error('Error checking module permission:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking module permission:', error);
      return false;
    }
  };

  return {
    modules,
    loading,
    canAccessModule,
    getModulesByCategory,
    getUserModules,
    checkModulePermission,
    refetch: fetchUserModules
  };
};
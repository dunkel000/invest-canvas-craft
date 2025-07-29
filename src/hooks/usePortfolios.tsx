import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  total_value?: number;
  currency?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  portfolio_id: string;
  name: string;
  symbol?: string;
  asset_type: string;
  quantity: number;
  purchase_price?: number;
  current_price?: number;
  total_value?: number;
  allocation_percentage?: number;
  target_allocation_percentage?: number;
  universe_asset_id?: string;
}

export const usePortfolios = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [portfolioAssets, setPortfolioAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolios = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
      
      // Select first portfolio if none selected
      if (data && data.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(data[0]);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast.error('Failed to fetch portfolios');
    }
  };

  const fetchPortfolioAssets = async (portfolioId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('user_id', user.id);

      if (error) throw error;
      setPortfolioAssets(data || []);
    } catch (error) {
      console.error('Error fetching portfolio assets:', error);
      toast.error('Failed to fetch portfolio assets');
    }
  };

  const createPortfolio = async (portfolioData: Partial<Portfolio>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          name: portfolioData.name || '',
          description: portfolioData.description,
          currency: portfolioData.currency,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchPortfolios();
      toast.success('Portfolio created successfully');
      return data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast.error('Failed to create portfolio');
      return null;
    }
  };

  const updatePortfolio = async (portfolioId: string, updates: Partial<Portfolio>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .update(updates)
        .eq('id', portfolioId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchPortfolios();
      toast.success('Portfolio updated successfully');
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast.error('Failed to update portfolio');
    }
  };

  const deletePortfolio = async (portfolioId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchPortfolios();
      if (selectedPortfolio?.id === portfolioId) {
        setSelectedPortfolio(portfolios[0] || null);
      }
      toast.success('Portfolio deleted successfully');
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast.error('Failed to delete portfolio');
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchPortfolios().finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchPortfolioAssets(selectedPortfolio.id);
    }
  }, [selectedPortfolio]);

  return {
    portfolios,
    selectedPortfolio,
    setSelectedPortfolio,
    portfolioAssets,
    loading,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    refreshPortfolios: fetchPortfolios,
    refreshAssets: () => selectedPortfolio && fetchPortfolioAssets(selectedPortfolio.id),
  };
};
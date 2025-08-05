import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { usePortfolios, Portfolio } from '@/hooks/usePortfolios';
import { PortfolioAllocation } from './PortfolioAllocation';
import { AssetPicker } from './AssetPicker';

export const PortfolioManager = () => {
  const {
    portfolios,
    selectedPortfolio,
    setSelectedPortfolio,
    portfolioAssets,
    loading,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = usePortfolios();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'USD',
  });

  const handleCreate = async () => {
    const result = await createPortfolio(formData);
    if (result) {
      setShowCreateDialog(false);
      setFormData({ name: '', description: '', currency: 'USD' });
    }
  };

  const handleEdit = async () => {
    if (!selectedPortfolio) return;
    await updatePortfolio(selectedPortfolio.id, formData);
    setShowEditDialog(false);
  };

  const handleDelete = async (portfolioId: string) => {
    if (confirm('Are you sure you want to delete this portfolio?')) {
      await deletePortfolio(portfolioId);
    }
  };

  const openEditDialog = (portfolio: Portfolio) => {
    setFormData({
      name: portfolio.name,
      description: portfolio.description || '',
      currency: portfolio.currency || 'USD',
    });
    setShowEditDialog(true);
  };

  const calculateTotalAllocation = () => {
    return portfolioAssets.reduce((sum, asset) => sum + (asset.allocation_percentage || 0), 0);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading portfolios...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Selection Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Custom Portfolio</h2>
          <Select
            value={selectedPortfolio?.id || ''}
            onValueChange={(value) => {
              const portfolio = portfolios.find(p => p.id === value);
              if (portfolio) setSelectedPortfolio(portfolio);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Portfolio Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!formData.name}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Grid */}
      {portfolios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Portfolios Yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Create your first portfolio to start managing your investments
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card 
              key={portfolio.id} 
              className={`cursor-pointer transition-all ${
                selectedPortfolio?.id === portfolio.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPortfolio(portfolio)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(portfolio);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(portfolio.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {portfolio.description && (
                  <p className="text-sm text-muted-foreground">{portfolio.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-semibold">
                      {portfolio.currency} {portfolio.total_value?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Assets</span>
                    <Badge variant="secondary">
                      {selectedPortfolio?.id === portfolio.id ? portfolioAssets.length : '-'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Portfolio Details */}
      {selectedPortfolio && (
        <Tabs defaultValue="allocation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Allocation - {selectedPortfolio.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Current allocation: {calculateTotalAllocation().toFixed(1)}%
                </p>
              </CardHeader>
              <CardContent>
                <PortfolioAllocation assets={portfolioAssets} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assets" className="space-y-4">
            <AssetPicker portfolioId={selectedPortfolio.id} />
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance - {selectedPortfolio.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Performance tracking coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Edit Portfolio Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Portfolio Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={!formData.name}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
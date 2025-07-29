import React, { memo, useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DollarSign, Edit2, Save, X } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export interface EditableInitialAssetNodeData {
  id?: string
  assetName?: string
  assetType?: string
  purchaseDate?: string
  costBasis?: number
  quantity?: number
  currentMarketValue?: number
  portfolioId?: string
  assetId?: string
}

const assetTypes = ['stock', 'bond', 'etf', 'crypto', 'real_estate', 'commodity', 'other'] as const

const EditableInitialAssetNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as EditableInitialAssetNodeData
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(nodeData)

  const handleSave = useCallback(async () => {
    try {
      if (nodeData.assetId) {
        // Update existing asset
        const { error } = await supabase
          .from('assets')
          .update({
            name: editData.assetName || 'Unnamed Asset',
            asset_type: (editData.assetType || 'stock') as any,
            quantity: editData.quantity || 0,
            purchase_price: editData.costBasis || 0,
            current_price: editData.currentMarketValue ? editData.currentMarketValue / (editData.quantity || 1) : 0,
            total_value: editData.currentMarketValue || 0,
          })
          .eq('id', nodeData.assetId)

        if (error) throw error
      } else {
        // Create new asset
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) throw new Error('Not authenticated')

        // Get or create default portfolio
        let portfolioId = nodeData.portfolioId
        if (!portfolioId) {
          const { data: portfolios } = await supabase
            .from('portfolios')
            .select('id')
            .eq('user_id', userData.user.id)
            .limit(1)

          if (portfolios && portfolios.length > 0) {
            portfolioId = portfolios[0].id
          } else {
            const { data: newPortfolio } = await supabase
              .from('portfolios')
              .insert([{
                name: 'Default Portfolio',
                user_id: userData.user.id
              }])
              .select('id')
              .single()

            portfolioId = newPortfolio?.id
          }
        }

        const { data: newAsset, error } = await supabase
          .from('assets')
          .insert({
            name: editData.assetName || 'Unnamed Asset',
            asset_type: (editData.assetType || 'stock') as any,
            quantity: editData.quantity || 0,
            purchase_price: editData.costBasis || 0,
            current_price: editData.currentMarketValue ? editData.currentMarketValue / (editData.quantity || 1) : 0,
            total_value: editData.currentMarketValue || 0,
            portfolio_id: portfolioId,
            user_id: userData.user.id
          })
          .select()
          .single()

        if (error) throw error
        
        // Update node data with new asset ID
        setEditData(prev => ({ ...prev, assetId: newAsset.id }))
      }

      setIsEditing(false)
      toast.success('Asset saved successfully')
    } catch (error) {
      console.error('Failed to save asset:', error)
      toast.error('Failed to save asset')
    }
  }, [editData, nodeData.assetId, nodeData.portfolioId])

  const handleCancel = useCallback(() => {
    setEditData(nodeData)
    setIsEditing(false)
  }, [nodeData])

  if (isEditing) {
    return (
      <Card className="min-w-[300px] border-border bg-card">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">Edit Asset</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleSave}>
                <Save className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Asset Name</label>
            <Input
              value={editData.assetName || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, assetName: e.target.value }))}
              placeholder="Asset name"
              className="h-8"
            />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground">Asset Type</label>
            <Select
              value={editData.assetType || ''}
              onValueChange={(value) => setEditData(prev => ({ ...prev, assetType: value }))}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Quantity</label>
              <Input
                type="number"
                value={editData.quantity || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                className="h-8"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Cost Basis</label>
              <Input
                type="number"
                value={editData.costBasis || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, costBasis: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                className="h-8"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Current Market Value</label>
            <Input
              type="number"
              value={editData.currentMarketValue || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, currentMarketValue: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className="h-8"
            />
          </div>
        </CardContent>
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'hsl(var(--primary))' }}
        />
      </Card>
    )
  }

  return (
    <Card className="min-w-[250px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm">Initial Asset</CardTitle>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsEditing(true)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="font-medium text-foreground">
            {nodeData.assetName || 'New Asset'}
          </div>
          {nodeData.assetType && (
            <Badge variant="outline" className="text-xs">
              {nodeData.assetType}
            </Badge>
          )}
          {nodeData.costBasis && (
            <div className="text-sm">
              <span className="text-muted-foreground">Cost Basis: </span>
              <span className="font-medium">${nodeData.costBasis.toLocaleString()}</span>
            </div>
          )}
          {nodeData.quantity && (
            <div className="text-sm">
              <span className="text-muted-foreground">Quantity: </span>
              <span className="font-medium">{nodeData.quantity}</span>
            </div>
          )}
          {nodeData.currentMarketValue && (
            <div className="text-sm">
              <span className="text-muted-foreground">Current Value: </span>
              <span className="font-medium">${nodeData.currentMarketValue.toLocaleString()}</span>
            </div>
          )}
          {nodeData.purchaseDate && (
            <div className="text-xs text-muted-foreground">
              Purchased: {new Date(nodeData.purchaseDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'hsl(var(--primary))' }}
      />
    </Card>
  )
})

EditableInitialAssetNode.displayName = 'EditableInitialAssetNode'

export default EditableInitialAssetNode
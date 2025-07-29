import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

export interface InitialAssetNodeData {
  assetName?: string
  assetType?: string
  purchaseDate?: string
  costBasis?: number
  quantity?: number
  currentMarketValue?: number
}

const InitialAssetNode = memo(({ data }: NodeProps) => {
  const nodeData = data as InitialAssetNodeData
  
  return (
    <Card className="min-w-[250px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">Initial Asset</CardTitle>
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

InitialAssetNode.displayName = 'InitialAssetNode'

export default InitialAssetNode
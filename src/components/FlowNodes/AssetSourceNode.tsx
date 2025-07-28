import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

export interface AssetSourceNodeData {
  label?: string
  assetId?: string
  assetName?: string
  assetType?: string
  quantity?: number
  currentPrice?: number
  riskCategory?: string
}

const AssetSourceNode = memo(({ data }: NodeProps) => {
  const nodeData = data as AssetSourceNodeData
  
  return (
    <Card className="min-w-[200px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">Asset Source</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="font-medium text-foreground">
            {nodeData.assetName || nodeData.label}
          </div>
          {nodeData.assetType && (
            <Badge variant="outline" className="text-xs">
              {nodeData.assetType}
            </Badge>
          )}
          {nodeData.quantity && nodeData.currentPrice && (
            <div className="text-xs text-muted-foreground">
              {nodeData.quantity} @ ${nodeData.currentPrice}
            </div>
          )}
          {nodeData.riskCategory && (
            <Badge variant="outline" className="text-xs">
              {nodeData.riskCategory} risk
            </Badge>
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

AssetSourceNode.displayName = 'AssetSourceNode'

export default AssetSourceNode
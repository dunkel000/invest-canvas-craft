import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle } from "lucide-react"

export interface RiskNodeData {
  label?: string
  riskCategory?: string
  riskScore?: number
  exposure?: number
  description?: string
}

const RiskNode = memo(({ data }: NodeProps) => {
  const nodeData = data as RiskNodeData
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 border-green-500/20 bg-green-500/10'
      case 'medium': return 'text-yellow-600 border-yellow-500/20 bg-yellow-500/10'
      case 'high': return 'text-orange-600 border-orange-500/20 bg-orange-500/10'
      case 'very_high': return 'text-red-600 border-red-500/20 bg-red-500/10'
      default: return 'text-gray-600 border-gray-500/20 bg-gray-500/10'
    }
  }
  
  const isHighRisk = ['high', 'very_high'].includes(nodeData.riskCategory || '')
  
  return (
    <Card className="min-w-[200px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          {isHighRisk ? (
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          ) : (
            <Shield className="w-4 h-4 text-green-500" />
          )}
          <CardTitle className="text-sm">Risk Assessment</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="font-medium text-foreground">
            {nodeData.label || 'Risk Node'}
          </div>
          {nodeData.riskCategory && (
            <Badge variant="outline" className={`text-xs ${getRiskColor(nodeData.riskCategory)}`}>
              {nodeData.riskCategory.replace('_', ' ')} risk
            </Badge>
          )}
          {nodeData.riskScore && (
            <div className="text-sm">
              <span className="text-muted-foreground">Score: </span>
              <span className="font-medium">{nodeData.riskScore}/100</span>
            </div>
          )}
          {nodeData.exposure && (
            <div className="text-sm">
              <span className="text-muted-foreground">Exposure: </span>
              <span className="font-medium">{nodeData.exposure}%</span>
            </div>
          )}
          {nodeData.description && (
            <div className="text-xs text-muted-foreground">
              {nodeData.description}
            </div>
          )}
        </div>
      </CardContent>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'hsl(var(--primary))' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'hsl(var(--primary))' }}
      />
    </Card>
  )
})

RiskNode.displayName = 'RiskNode'

export default RiskNode
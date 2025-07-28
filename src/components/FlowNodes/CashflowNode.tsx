import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export interface CashflowNodeData {
  label?: string
  cashflowType?: string
  amount?: number
  frequency?: string
  description?: string
}

const CashflowNode = memo(({ data }: NodeProps) => {
  const nodeData = data as CashflowNodeData
  
  const isIncome = ['income', 'dividend', 'interest', 'capital_gain'].includes(nodeData.cashflowType || '')
  
  return (
    <Card className="min-w-[200px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          {isIncome ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <CardTitle className="text-sm">Cashflow</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="font-medium text-foreground">
            {nodeData.label || 'Cashflow Node'}
          </div>
          {nodeData.cashflowType && (
            <Badge variant="outline" className="text-xs">
              {nodeData.cashflowType.replace('_', ' ')}
            </Badge>
          )}
          {nodeData.amount && (
            <div className={`text-sm font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
              {isIncome ? '+' : '-'}${Math.abs(nodeData.amount).toLocaleString()}
            </div>
          )}
          {nodeData.frequency && (
            <div className="text-xs text-muted-foreground">
              {nodeData.frequency}
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

CashflowNode.displayName = 'CashflowNode'

export default CashflowNode
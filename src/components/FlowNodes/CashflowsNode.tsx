import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export interface CashflowEntry {
  date: string
  amount: number
  type: string
}

export interface CashflowsNodeData {
  label?: string
  cashflows?: CashflowEntry[]
}

const CashflowsNode = memo(({ data }: NodeProps) => {
  const nodeData = data as CashflowsNodeData
  
  const totalInflow = nodeData.cashflows?.reduce((sum, cf) => 
    ['Dividend', 'Rent', 'Interest'].includes(cf.type) ? sum + cf.amount : sum, 0) || 0
  
  const totalOutflow = nodeData.cashflows?.reduce((sum, cf) => 
    ['Expense'].includes(cf.type) ? sum + cf.amount : sum, 0) || 0
  
  return (
    <Card className="min-w-[250px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <CardTitle className="text-sm">Cashflows</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="font-medium text-foreground">
            {nodeData.label || 'Asset Cashflows'}
          </div>
          
          {nodeData.cashflows && nodeData.cashflows.length > 0 ? (
            <>
              <div className="text-sm">
                <span className="text-muted-foreground">Total Entries: </span>
                <span className="font-medium">{nodeData.cashflows.length}</span>
              </div>
              
              {totalInflow > 0 && (
                <div className="text-sm text-green-600">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +${totalInflow.toLocaleString()}
                </div>
              )}
              
              {totalOutflow > 0 && (
                <div className="text-sm text-red-600">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  -${totalOutflow.toLocaleString()}
                </div>
              )}
              
              <div className="space-y-1">
                {nodeData.cashflows.slice(0, 3).map((cf, index) => (
                  <div key={index} className="text-xs">
                    <Badge variant="outline" className="text-xs mr-1">
                      {cf.type}
                    </Badge>
                    <span className={cf.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(cf.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
                {nodeData.cashflows.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{nodeData.cashflows.length - 3} more...
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-xs text-muted-foreground">
              No cashflows defined
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

CashflowsNode.displayName = 'CashflowsNode'

export default CashflowsNode
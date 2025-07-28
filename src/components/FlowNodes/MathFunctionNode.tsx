import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"

export interface MathFunctionNodeData {
  label?: string
  functionType?: string
  formula?: string
  parameters?: any
  description?: string
}

const MathFunctionNode = memo(({ data }: NodeProps) => {
  const nodeData = data as MathFunctionNodeData
  
  const getFunctionSymbol = (type: string) => {
    switch (type) {
      case 'add': return '+'
      case 'subtract': return '-'
      case 'multiply': return '×'
      case 'divide': return '÷'
      case 'percentage': return '%'
      case 'compound': return 'C'
      case 'present_value': return 'PV'
      case 'future_value': return 'FV'
      default: return 'f(x)'
    }
  }
  
  return (
    <Card className="min-w-[200px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-500" />
          <CardTitle className="text-sm">Math Function</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="font-medium text-foreground">
            {nodeData.label || 'Math Function'}
          </div>
          {nodeData.functionType && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {nodeData.functionType.replace('_', ' ')}
              </Badge>
              <span className="text-lg font-mono text-blue-600">
                {getFunctionSymbol(nodeData.functionType)}
              </span>
            </div>
          )}
          {nodeData.formula && (
            <div className="text-xs font-mono bg-muted p-2 rounded">
              {nodeData.formula}
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

MathFunctionNode.displayName = 'MathFunctionNode'

export default MathFunctionNode
import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"

export interface FormulaEntry {
  name: string
  expression: string
}

export interface MathFormulasNodeData {
  label?: string
  formulas?: FormulaEntry[]
}

const MathFormulasNode = memo(({ data }: NodeProps) => {
  const nodeData = data as MathFormulasNodeData
  
  const predefinedFormulas = [
    { name: 'ROI', expression: '(currentMarketValue - costBasis) / costBasis' },
    { name: 'IRR', expression: 'Internal Rate of Return' },
    { name: 'NPV', expression: 'Net Present Value' },
    { name: 'YOC', expression: 'Yield on Cost' }
  ]
  
  const displayFormulas = nodeData.formulas || predefinedFormulas.slice(0, 2)
  
  return (
    <Card className="min-w-[250px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-500" />
          <CardTitle className="text-sm">Math Formulas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="font-medium text-foreground">
            {nodeData.label || 'Financial Analytics'}
          </div>
          
          {displayFormulas.length > 0 ? (
            <>
              <div className="text-sm">
                <span className="text-muted-foreground">Active Formulas: </span>
                <span className="font-medium">{displayFormulas.length}</span>
              </div>
              
              <div className="space-y-1">
                {displayFormulas.map((formula, index) => (
                  <div key={index} className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {formula.name}
                    </Badge>
                    <div className="text-xs font-mono bg-muted p-1 rounded text-muted-foreground">
                      {formula.expression.length > 30 
                        ? `${formula.expression.substring(0, 30)}...` 
                        : formula.expression
                      }
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-xs text-muted-foreground">
              No formulas defined
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

MathFormulasNode.displayName = 'MathFormulasNode'

export default MathFormulasNode
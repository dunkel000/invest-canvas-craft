import React, { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle } from "lucide-react"

export interface RiskAssessmentNodeData {
  label?: string
  riskClassifications?: string[]
}

const RiskAssessmentNode = memo(({ data }: NodeProps) => {
  const nodeData = data as RiskAssessmentNodeData
  
  const predefinedRisks = [
    'Liquidity Risk',
    'Market Risk', 
    'Credit Risk',
    'Operational Risk'
  ]
  
  const activeRisks = nodeData.riskClassifications || predefinedRisks.slice(0, 2)
  
  const getRiskColor = (risk: string) => {
    const riskLower = risk.toLowerCase()
    if (riskLower.includes('market') || riskLower.includes('operational')) {
      return 'text-red-600 border-red-500/20 bg-red-500/10'
    } else if (riskLower.includes('credit')) {
      return 'text-orange-600 border-orange-500/20 bg-orange-500/10'
    } else if (riskLower.includes('liquidity')) {
      return 'text-yellow-600 border-yellow-500/20 bg-yellow-500/10'
    }
    return 'text-gray-600 border-gray-500/20 bg-gray-500/10'
  }
  
  const hasHighRisk = activeRisks.some(risk => 
    risk.toLowerCase().includes('market') || risk.toLowerCase().includes('operational')
  )
  
  return (
    <Card className="min-w-[250px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          {hasHighRisk ? (
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
            {nodeData.label || 'Asset Risk Profile'}
          </div>
          
          {activeRisks.length > 0 ? (
            <>
              <div className="text-sm">
                <span className="text-muted-foreground">Risk Factors: </span>
                <span className="font-medium">{activeRisks.length}</span>
              </div>
              
              <div className="space-y-1">
                {activeRisks.map((risk, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`text-xs ${getRiskColor(risk)}`}
                  >
                    {risk}
                  </Badge>
                ))}
              </div>
              
              {hasHighRisk && (
                <div className="text-xs text-orange-600 font-medium">
                  ⚠️ High Risk Asset
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-muted-foreground">
              No risk factors defined
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

RiskAssessmentNode.displayName = 'RiskAssessmentNode'

export default RiskAssessmentNode
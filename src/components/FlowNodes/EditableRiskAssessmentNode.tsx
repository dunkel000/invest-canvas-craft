import React, { memo, useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, AlertTriangle, Edit2, Save, X, Plus, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export interface RiskFactor {
  id?: string
  name: string
  severity: 'low' | 'medium' | 'high'
  description?: string
}

export interface EditableRiskAssessmentNodeData {
  id?: string
  label?: string
  riskClassifications?: string[]
  riskFactors?: RiskFactor[]
  assetId?: string
}

const predefinedRisks = [
  { name: 'Market Risk', severity: 'high' as const, description: 'Risk of losses due to market movements' },
  { name: 'Liquidity Risk', severity: 'medium' as const, description: 'Risk of not being able to sell quickly' },
  { name: 'Credit Risk', severity: 'medium' as const, description: 'Risk of counterparty default' },
  { name: 'Operational Risk', severity: 'low' as const, description: 'Risk from operational failures' },
  { name: 'Currency Risk', severity: 'medium' as const, description: 'Risk from currency fluctuations' },
  { name: 'Interest Rate Risk', severity: 'medium' as const, description: 'Risk from interest rate changes' }
]

const EditableRiskAssessmentNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as EditableRiskAssessmentNodeData
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(nodeData)
  const [selectedRisks, setSelectedRisks] = useState<string[]>(
    nodeData.riskClassifications || []
  )

  const handleSave = useCallback(async () => {
    try {
      // Update the edit data with selected risks
      const updatedData = {
        ...editData,
        riskClassifications: selectedRisks,
        riskFactors: predefinedRisks.filter(risk => selectedRisks.includes(risk.name))
      }
      
      setEditData(updatedData)
      setIsEditing(false)
      toast.success('Risk assessment saved successfully')
    } catch (error) {
      console.error('Failed to save risk assessment:', error)
      toast.error('Failed to save risk assessment')
    }
  }, [editData, selectedRisks])

  const handleCancel = useCallback(() => {
    setEditData(nodeData)
    setSelectedRisks(nodeData.riskClassifications || [])
    setIsEditing(false)
  }, [nodeData])

  const toggleRisk = useCallback((riskName: string) => {
    setSelectedRisks(prev => 
      prev.includes(riskName)
        ? prev.filter(r => r !== riskName)
        : [...prev, riskName]
    )
  }, [])

  const activeRisks = editData.riskClassifications || nodeData.riskClassifications || []
  
  const getRiskColor = (risk: string) => {
    const riskLower = risk.toLowerCase()
    if (riskLower.includes('market') || riskLower.includes('operational')) {
      return 'text-red-600 border-red-500/20 bg-red-500/10'
    } else if (riskLower.includes('credit') || riskLower.includes('currency')) {
      return 'text-orange-600 border-orange-500/20 bg-orange-500/10'
    } else if (riskLower.includes('liquidity') || riskLower.includes('interest')) {
      return 'text-yellow-600 border-yellow-500/20 bg-yellow-500/10'
    }
    return 'text-gray-600 border-gray-500/20 bg-gray-500/10'
  }
  
  const hasHighRisk = activeRisks.some(risk => 
    risk.toLowerCase().includes('market') || risk.toLowerCase().includes('operational')
  )

  if (isEditing) {
    return (
      <Card className="min-w-[350px] border-border bg-card">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <CardTitle className="text-sm">Edit Risk Assessment</CardTitle>
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
            <label className="text-xs text-muted-foreground">Label</label>
            <Input
              value={editData.label || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Risk assessment label"
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Risk Factors</label>
            <div className="space-y-2">
              {predefinedRisks.map((risk) => (
                <div key={risk.name} className="flex items-start space-x-2 p-2 border border-border rounded">
                  <Checkbox
                    checked={selectedRisks.includes(risk.name)}
                    onCheckedChange={() => toggleRisk(risk.name)}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{risk.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          risk.severity === 'high' ? 'text-red-600 border-red-500/20 bg-red-500/10' :
                          risk.severity === 'medium' ? 'text-orange-600 border-orange-500/20 bg-orange-500/10' :
                          'text-yellow-600 border-yellow-500/20 bg-yellow-500/10'
                        }`}
                      >
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {risk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
  }

  return (
    <Card className="min-w-[250px] border-border bg-card">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasHighRisk ? (
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            ) : (
              <Shield className="w-4 h-4 text-green-500" />
            )}
            <CardTitle className="text-sm">Risk Assessment</CardTitle>
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

EditableRiskAssessmentNode.displayName = 'EditableRiskAssessmentNode'

export default EditableRiskAssessmentNode
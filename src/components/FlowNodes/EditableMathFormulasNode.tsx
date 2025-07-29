import React, { memo, useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calculator, Edit2, Save, X, Plus, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export interface FormulaEntry {
  id?: string
  name: string
  expression: string
  description?: string
}

export interface EditableMathFormulasNodeData {
  id?: string
  label?: string
  formulas?: FormulaEntry[]
  assetId?: string
}

const functionTypes = ['roi', 'irr', 'npv', 'yield', 'volatility', 'sharpe_ratio', 'custom']

const EditableMathFormulasNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as EditableMathFormulasNodeData
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(nodeData)

  const predefinedFormulas = [
    { name: 'ROI', expression: '(currentMarketValue - costBasis) / costBasis', description: 'Return on Investment' },
    { name: 'IRR', expression: 'Internal Rate of Return', description: 'Internal Rate of Return calculation' },
    { name: 'NPV', expression: 'Net Present Value', description: 'Net Present Value calculation' },
    { name: 'YOC', expression: 'Yield on Cost', description: 'Yield on Cost calculation' }
  ]

  const handleSave = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      // Save math functions to database
      if (editData.formulas && editData.formulas.length > 0) {
        const functionsToUpsert = editData.formulas.map(formula => ({
          id: formula.id || undefined,
          user_id: userData.user.id,
          function_type: 'custom' as any,
          formula: formula.expression,
          description: formula.description || formula.name,
          parameters: {
            name: formula.name,
            expression: formula.expression
          }
        }))

        const { error } = await supabase
          .from('math_functions')
          .upsert(functionsToUpsert)

        if (error) throw error
      }

      setIsEditing(false)
      toast.success('Math formulas saved successfully')
    } catch (error) {
      console.error('Failed to save math formulas:', error)
      toast.error('Failed to save math formulas')
    }
  }, [editData])

  const handleCancel = useCallback(() => {
    setEditData(nodeData)
    setIsEditing(false)
  }, [nodeData])

  const addFormula = useCallback(() => {
    const newFormula: FormulaEntry = {
      name: 'New Formula',
      expression: '',
      description: ''
    }
    setEditData(prev => ({
      ...prev,
      formulas: [...(prev.formulas || []), newFormula]
    }))
  }, [])

  const removeFormula = useCallback((index: number) => {
    setEditData(prev => ({
      ...prev,
      formulas: prev.formulas?.filter((_, i) => i !== index)
    }))
  }, [])

  const updateFormula = useCallback((index: number, field: keyof FormulaEntry, value: any) => {
    setEditData(prev => ({
      ...prev,
      formulas: prev.formulas?.map((formula, i) => 
        i === index ? { ...formula, [field]: value } : formula
      )
    }))
  }, [])

  const displayFormulas = editData.formulas || predefinedFormulas.slice(0, 2)

  if (isEditing) {
    return (
      <Card className="min-w-[400px] border-border bg-card">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-sm">Edit Math Formulas</CardTitle>
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
              placeholder="Formula set label"
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Formulas</label>
              <Button size="sm" variant="outline" onClick={addFormula}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            
            {editData.formulas?.map((formula, index) => (
              <div key={index} className="border border-border rounded p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Formula {index + 1}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeFormula(index)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <div>
                  <Input
                    value={formula.name}
                    onChange={(e) => updateFormula(index, 'name', e.target.value)}
                    placeholder="Formula name"
                    className="h-8"
                  />
                </div>
                
                <div>
                  <Textarea
                    value={formula.expression}
                    onChange={(e) => updateFormula(index, 'expression', e.target.value)}
                    placeholder="Formula expression"
                    className="min-h-[60px] text-xs font-mono"
                  />
                </div>

                <div>
                  <Input
                    value={formula.description || ''}
                    onChange={(e) => updateFormula(index, 'description', e.target.value)}
                    placeholder="Description (optional)"
                    className="h-8"
                  />
                </div>
              </div>
            ))}
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
            <Calculator className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-sm">Math Formulas</CardTitle>
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

EditableMathFormulasNode.displayName = 'EditableMathFormulasNode'

export default EditableMathFormulasNode
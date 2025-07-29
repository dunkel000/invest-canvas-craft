import React, { memo, useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Edit2, Save, X, Plus, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export interface CashflowEntry {
  id?: string
  date: string
  amount: number
  type: string
  description?: string
}

export interface EditableCashflowsNodeData {
  id?: string
  label?: string
  cashflows?: CashflowEntry[]
  assetId?: string
}

const cashflowTypes = ['Dividend', 'Interest', 'Rent', 'Expense', 'Fee', 'Other']

const EditableCashflowsNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as EditableCashflowsNodeData
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(nodeData)

  const totalInflow = editData.cashflows?.reduce((sum, cf) => 
    ['dividend', 'rent', 'interest'].includes(cf.type.toLowerCase()) ? sum + cf.amount : sum, 0) || 0
  
  const totalOutflow = editData.cashflows?.reduce((sum, cf) => 
    ['expense', 'fee'].includes(cf.type.toLowerCase()) ? sum + cf.amount : sum, 0) || 0

  const handleSave = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      // Save cashflows to database
      if (editData.cashflows && editData.cashflows.length > 0) {
        const cashflowsToUpsert = editData.cashflows.map(cf => ({
          id: cf.id || undefined,
          user_id: userData.user.id,
          asset_id: editData.assetId || null,
          amount: cf.amount,
          cashflow_type: cf.type.toLowerCase() as any,
          description: cf.description || null,
          start_date: cf.date,
          frequency: 'one-time'
        }))

        const { error } = await supabase
          .from('cashflows')
          .upsert(cashflowsToUpsert)

        if (error) throw error
      }

      setIsEditing(false)
      toast.success('Cashflows saved successfully')
    } catch (error) {
      console.error('Failed to save cashflows:', error)
      toast.error('Failed to save cashflows')
    }
  }, [editData])

  const handleCancel = useCallback(() => {
    setEditData(nodeData)
    setIsEditing(false)
  }, [nodeData])

  const addCashflow = useCallback(() => {
    const newCashflow: CashflowEntry = {
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      type: 'Dividend',
      description: ''
    }
    setEditData(prev => ({
      ...prev,
      cashflows: [...(prev.cashflows || []), newCashflow]
    }))
  }, [])

  const removeCashflow = useCallback((index: number) => {
    setEditData(prev => ({
      ...prev,
      cashflows: prev.cashflows?.filter((_, i) => i !== index)
    }))
  }, [])

  const updateCashflow = useCallback((index: number, field: keyof CashflowEntry, value: any) => {
    setEditData(prev => ({
      ...prev,
      cashflows: prev.cashflows?.map((cf, i) => 
        i === index ? { ...cf, [field]: value } : cf
      )
    }))
  }, [])

  if (isEditing) {
    return (
      <Card className="min-w-[350px] border-border bg-card">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <CardTitle className="text-sm">Edit Cashflows</CardTitle>
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
              placeholder="Cashflow label"
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Cashflows</label>
              <Button size="sm" variant="outline" onClick={addCashflow}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            
            {editData.cashflows?.map((cf, index) => (
              <div key={index} className="border border-border rounded p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Entry {index + 1}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeCashflow(index)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="date"
                      value={cf.date}
                      onChange={(e) => updateCashflow(index, 'date', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      value={cf.amount}
                      onChange={(e) => updateCashflow(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Amount"
                      className="h-8"
                    />
                  </div>
                </div>
                
                <Select
                  value={cf.type}
                  onValueChange={(value) => updateCashflow(index, 'type', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cashflowTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <TrendingUp className="w-4 h-4 text-green-500" />
            <CardTitle className="text-sm">Cashflows</CardTitle>
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

EditableCashflowsNode.displayName = 'EditableCashflowsNode'

export default EditableCashflowsNode
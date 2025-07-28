import React, { useCallback, useState } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Save, Download } from "lucide-react"

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Portfolio Data Source' },
    position: { x: 100, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))'
    }
  },
  {
    id: '2',
    data: { label: 'Risk Assessment' },
    position: { x: 300, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))'
    }
  },
  {
    id: '3',
    data: { label: 'Asset Allocation' },
    position: { x: 500, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))'
    }
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Portfolio Optimization' },
    position: { x: 700, y: 100 },
    style: { 
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: '1px solid hsl(var(--primary))'
    }
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))' }
  },
]

export function FlowDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const addNode = () => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { label: `New Asset ${nodes.length + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: { 
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))'
      }
    }
    setNodes((nds) => [...nds, newNode])
  }

  return (
    <Card className="bg-card border-border h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Investment Flow Designer</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Design your investment portfolio flow and asset relationships
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={addNode} size="sm" className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[500px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
          <Controls />
          <MiniMap 
            style={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))'
            }}
          />
          <Background 
            color="hsl(var(--border))" 
            gap={16} 
          />
        </ReactFlow>
      </CardContent>
    </Card>
  )
}
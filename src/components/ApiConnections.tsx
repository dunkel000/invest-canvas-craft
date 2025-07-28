import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Settings, Check, AlertCircle, ExternalLink } from "lucide-react"

const connectedApis = [
  {
    id: 1,
    name: "Interactive Brokers",
    type: "Brokerage",
    status: "connected",
    lastSync: "2 minutes ago",
    accounts: 3,
    assets: 145
  },
  {
    id: 2,
    name: "Coinbase Pro",
    type: "Crypto Exchange",
    status: "connected",
    lastSync: "5 minutes ago",
    accounts: 1,
    assets: 12
  },
  {
    id: 3,
    name: "TD Ameritrade",
    type: "Brokerage",
    status: "error",
    lastSync: "2 hours ago",
    accounts: 2,
    assets: 67
  },
  {
    id: 4,
    name: "Fidelity",
    type: "Brokerage",
    status: "connecting",
    lastSync: "N/A",
    accounts: 0,
    assets: 0
  }
]

const availableApis = [
  { name: "Charles Schwab", type: "Brokerage", description: "Connect your Schwab accounts" },
  { name: "E*TRADE", type: "Brokerage", description: "Sync E*TRADE portfolios" },
  { name: "Binance", type: "Crypto Exchange", description: "Import crypto holdings" },
  { name: "Alpha Vantage", type: "Market Data", description: "Real-time market data" }
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'connected':
      return <Badge className="bg-success/10 text-success border-success/20"><Check className="w-3 h-3 mr-1" />Connected</Badge>
    case 'error':
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>
    case 'connecting':
      return <Badge variant="secondary">Connecting...</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function ApiConnections() {
  return (
    <div className="space-y-6">
      {/* Connected APIs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Connected APIs</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your external portfolio connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedApis.map((api) => (
            <div key={api.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/5">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{api.name}</h3>
                  <p className="text-sm text-muted-foreground">{api.type} • Last sync: {api.lastSync}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">{api.accounts} accounts</span>
                    <span className="text-xs text-muted-foreground">{api.assets} assets</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(api.status)}
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add New Connection */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Available Connections</CardTitle>
            <CardDescription className="text-muted-foreground">
              Connect new external portfolio sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableApis.map((api) => (
              <div key={api.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">{api.name}</h4>
                  <p className="text-sm text-muted-foreground">{api.description}</p>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="w-3 h-3 mr-1" />
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Custom API Connection</CardTitle>
            <CardDescription className="text-muted-foreground">
              Connect using custom API credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-name">API Name</Label>
              <Input id="api-name" placeholder="Enter API name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input id="api-endpoint" placeholder="https://api.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="Enter API key" />
            </div>
            <Button className="w-full bg-primary text-primary-foreground">
              Test & Connect
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
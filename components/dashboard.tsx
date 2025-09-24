"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAuth } from "@/contexts/auth-context"
import {
  Package,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  Activity,
  Shield,
  Wrench,
  RefreshCw,
  Link,
  FileCheck,
} from "lucide-react"
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"

const chartData = [
  { month: "Jan", kegs: 186, revenue: 80 },
  { month: "Feb", kegs: 305, revenue: 200 },
  { month: "Mar", kegs: 237, revenue: 120 },
  { month: "Apr", kegs: 273, revenue: 190 },
  { month: "May", kegs: 209, revenue: 130 },
  { month: "Jun", kegs: 214, revenue: 140 },
]

const kegStatusData = [
  { name: "At Customer", value: 47, count: 587, color: "#0088FE" },
  { name: "In Transit", value: 27, count: 337, color: "#00C49F" },
  { name: "At Brewery", value: 15, count: 187, color: "#FFBB28" },
  { name: "Maintenance", value: 8, count: 100, color: "#FF8042" },
  { name: "Refilling", value: 3, count: 37, color: "#8884D8" },
]

const temperatureData = [
  { time: "00:00", temp: 38 },
  { time: "04:00", temp: 37 },
  { time: "08:00", temp: 39 },
  { time: "12:00", temp: 41 },
  { time: "16:00", temp: 40 },
  { time: "20:00", temp: 38 },
]

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, {user?.name}! Here's your {user?.role.toLowerCase()} overview.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1 text-xs">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">View Reports</span>
            <span className="sm:hidden">Reports</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Kegs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+8%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Refill Status</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> efficiency gain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600">-3</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Keg Production & Revenue</CardTitle>
            <CardDescription className="text-sm">Monthly overview of keg production and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                kegs: {
                  label: "Kegs",
                  color: "hsl(var(--chart-1))",
                },
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[250px] sm:h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="kegs"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="2"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Keg Status Distribution</CardTitle>
            <CardDescription className="text-sm">Current distribution of keg locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  value: {
                    label: "Percentage",
                  },
                }}
                className="h-[180px] sm:h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kegStatusData} layout="horizontal" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 50]} fontSize={9} tickCount={4} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={45}
                      fontSize={8}
                      tickFormatter={(value) => (value.length > 8 ? value.substring(0, 8) + "..." : value)}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-md">
                              <p className="font-medium text-sm">{data.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {data.value}% ({data.count} kegs)
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:gap-2 mt-4">
              {kegStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Blockchain Status</CardTitle>
            <Link className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-lg font-bold text-green-600">Connected</div>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Smart Contracts</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-lg font-bold">v2.4.1</div>
            <p className="text-xs text-muted-foreground">Latest version</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Verification System</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-lg font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">Integrity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-lg font-bold">2 min</div>
            <p className="text-xs text-muted-foreground">ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            <CardDescription className="text-sm">Latest updates from your supply chain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Keg #KT-2847 delivered to Downtown Brewery</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                Delivered
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Shipment #SH-1234 departed from warehouse</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                In Transit
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Temperature alert for Keg #KT-2845</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <Badge variant="destructive" className="text-xs flex-shrink-0">
                Alert
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">New partner location: Craft Beer Co.</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                New
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Batch #B-456 completed quality check</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                Quality
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Temperature Monitoring</CardTitle>
            <CardDescription className="text-sm">Real-time temperature tracking for active shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                temp: {
                  label: "Temperature (°F)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[180px] sm:h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <XAxis dataKey="time" fontSize={10} />
                  <YAxis domain={[35, 45]} fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-3))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-green-600">38°F</div>
                <div className="text-xs text-muted-foreground">Current Avg</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-blue-600">37°F</div>
                <div className="text-xs text-muted-foreground">Min Today</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-red-600">41°F</div>
                <div className="text-xs text-muted-foreground">Max Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Supply Chain Performance</CardTitle>
          <CardDescription className="text-sm">Key performance indicators across your operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Kegs in Production</span>
                <span>847 / 1000</span>
              </div>
              <Progress value={84.7} className="h-2" />
              <div className="text-xs text-muted-foreground">84.7% capacity utilized</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Kegs in Transit</span>
                <span>156 / 200</span>
              </div>
              <Progress value={78} className="h-2" />
              <div className="text-xs text-muted-foreground">78% of fleet active</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Kegs Delivered</span>
                <span>1844 / 2000</span>
              </div>
              <Progress value={92.2} className="h-2" />
              <div className="text-xs text-muted-foreground">92.2% delivery target met</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 pt-4">
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">On-Time Delivery</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">99.2%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Quality Score</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">97.8%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Customer Satisfaction</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">99.9%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

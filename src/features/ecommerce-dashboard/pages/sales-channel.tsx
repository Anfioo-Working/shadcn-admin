import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { channelData } from '@/features/ecommerce-dashboard/data/dashboard-data'

// 渠道详细数据（基于 channelData 扩展）
const channelDetailData = [
  { name: '独立站', gmv: 985200, orders: 5234, conversionRate: 4.2, profitRate: 35.5 },
  { name: 'TikTok小店', gmv: 743100, orders: 4821, conversionRate: 6.8, profitRate: 28.3 },
  { name: '亚马逊', gmv: 521700, orders: 3156, conversionRate: 3.5, profitRate: 32.1 },
  { name: '抖音商城', gmv: 387400, orders: 2893, conversionRate: 5.2, profitRate: 26.8 },
  { name: '小程序', gmv: 209992, orders: 1423, conversionRate: 7.1, profitRate: 38.2 },
]

export function SalesChannelPage() {
  const total = channelData.reduce((sum, item) => sum + item.value, 0)

  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">渠道销售分析</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 渠道销售额饼图 */}
          <Card>
            <CardHeader>
              <CardTitle>渠道销售额占比</CardTitle>
              <CardDescription>各渠道销售分布详情</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
                        }
                        labelLine={true}
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value) => [
                          `¥${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                          '',
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="space-y-3">
                    {channelData.map((channel) => (
                      <div
                        key={channel.name}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: channel.color }}
                          />
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            ¥{channel.value.toLocaleString()}
                          </span>
                          <Badge variant="secondary">
                            {((channel.value / total) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 各渠道详细数据表格 */}
          <Card>
            <CardHeader>
              <CardTitle>渠道详细数据</CardTitle>
              <CardDescription>各渠道销售指标明细</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>渠道名称</TableHead>
                    <TableHead className="text-right">GMV (元)</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                    <TableHead className="text-right">转化率</TableHead>
                    <TableHead className="text-right">毛利率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelDetailData.map((channel) => (
                    <TableRow key={channel.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: channelData.find(
                                (c) => c.name === channel.name
                              )?.color,
                            }}
                          />
                          {channel.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{channel.gmv.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {channel.orders.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            channel.conversionRate >= 5
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {channel.conversionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            channel.profitRate >= 30
                              ? 'default'
                              : channel.profitRate >= 25
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {channel.profitRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
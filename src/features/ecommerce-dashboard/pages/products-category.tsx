import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

// 品类数据（基于 dashboard-data 生成）
const categoryData = [
  { name: '服装', gmv: 892400, orders: 5823, profitRate: 35.2, color: '#6366f1' },
  { name: '3C数码', gmv: 756800, orders: 4156, profitRate: 28.5, color: '#ec4899' },
  { name: '家居', gmv: 523100, orders: 3245, profitRate: 22.8, color: '#f59e0b' },
  { name: '工具', gmv: 387500, orders: 2867, profitRate: 32.1, color: '#06b6d4' },
  { name: '美妆', gmv: 287592, orders: 2336, profitRate: 42.3, color: '#10b981' },
]

// 饼图数据
const categoryPieData = categoryData.map(item => ({
  name: item.name,
  value: item.gmv,
  color: item.color,
}))

export function ProductsCategoryPage() {
  const total = categoryPieData.reduce((sum, item) => sum + item.value, 0)

  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">品类分析</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 品类销售占比饼图 */}
          <Card>
            <CardHeader>
              <CardTitle>各品类销售占比</CardTitle>
              <CardDescription>各品类GMV分布详情</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
                        }
                        labelLine={true}
                      >
                        {categoryPieData.map((entry, index) => (
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
                    {categoryData.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            ¥{category.gmv.toLocaleString()}
                          </span>
                          <Badge variant="secondary">
                            {((category.gmv / total) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 品类数据卡片 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {categoryData.map((category) => (
              <Card key={category.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {category.name}
                    </CardTitle>
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">GMV</p>
                      <p className="text-xl font-bold">
                        ¥{category.gmv.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">订单数</p>
                      <p className="text-lg font-semibold">
                        {category.orders.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">毛利率</p>
                      <Badge
                        variant={
                          category.profitRate >= 35
                            ? 'default'
                            : category.profitRate >= 25
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {category.profitRate}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Main>
    </>
  )
}
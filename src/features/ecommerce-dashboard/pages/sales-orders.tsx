import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { detailRows } from '@/features/ecommerce-dashboard/data/dashboard-data'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Package, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react'

// 订单状态配置
const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  '待发货': { label: '待发货', variant: 'outline', color: 'text-amber-600' },
  '待付款': { label: '待付款', variant: 'secondary', color: 'text-blue-600' },
  '运输中': { label: '运输中', variant: 'default', color: 'text-indigo-600' },
  '已完成': { label: '已完成', variant: 'outline', color: 'text-emerald-600' },
  '已退款': { label: '已退款', variant: 'destructive', color: 'text-red-600' },
  '已取消': { label: '已取消', variant: 'destructive', color: 'text-gray-600' },
}

// 订单状态统计卡片组件
function StatusCard({
  title,
  count,
  icon,
  bgColor,
}: {
  title: string
  count: number
  icon: React.ReactNode
  bgColor: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{count.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function SalesOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 计算各状态订单数量
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      '待发货': 0,
      '待付款': 0,
      '运输中': 0,
      '已完成': 0,
      '已取消': 0,
    }
    detailRows.forEach((row) => {
      if (counts[row.status] !== undefined) {
        counts[row.status]++
      }
    })
    return counts
  }, [])

  // 筛选订单数据
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return detailRows
    const term = searchTerm.toLowerCase()
    return detailRows.filter(
      (row) =>
        row.orderNo.toLowerCase().includes(term) ||
        row.product.toLowerCase().includes(term) ||
        row.channel.toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term)
    )
  }, [searchTerm])

  // 分页数据
  const totalPages = Math.ceil(filteredOrders.length / pageSize)
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, currentPage])

  // 获取状态显示配置
  const getStatusDisplay = (status: string) => {
    return statusConfig[status] || { label: status, variant: 'outline' as const, color: 'text-gray-600' }
  }

  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">订单管理</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 订单状态统计卡片行 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatusCard
              title="待发货"
              count={statusCounts['待发货']}
              icon={<Package className="h-6 w-6 text-amber-600" />}
              bgColor="bg-amber-50 dark:bg-amber-950/30"
            />
            <StatusCard
              title="待付款"
              count={statusCounts['待付款']}
              icon={<CreditCard className="h-6 w-6 text-blue-600" />}
              bgColor="bg-blue-50 dark:bg-blue-950/30"
            />
            <StatusCard
              title="运输中"
              count={statusCounts['运输中']}
              icon={<Truck className="h-6 w-6 text-indigo-600" />}
              bgColor="bg-indigo-50 dark:bg-indigo-950/30"
            />
            <StatusCard
              title="已完成"
              count={statusCounts['已完成']}
              icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
              bgColor="bg-emerald-50 dark:bg-emerald-950/30"
            />
            <StatusCard
              title="已取消"
              count={statusCounts['已取消']}
              icon={<XCircle className="h-6 w-6 text-gray-600" />}
              bgColor="bg-gray-50 dark:bg-gray-950/30"
            />
          </div>

          {/* 订单搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索订单号、商品名称、渠道..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // 搜索时重置页码
              }}
              className="pl-9"
            />
          </div>

          {/* 订单数据表格 */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单号</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead>渠道</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((row) => {
                      const statusDisplay = getStatusDisplay(row.status)
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.orderNo}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{row.product}</span>
                              <span className="text-xs text-muted-foreground">{row.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell>{row.channel}</TableCell>
                          <TableCell>
                            <span className="font-medium">¥{row.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusDisplay.variant} className={statusDisplay.color}>
                              {statusDisplay.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="text-center">
                            <button className="text-primary hover:underline text-sm">
                              查看详情
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredOrders.length)} 条，共 {filteredOrders.length} 条
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  上一页
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary text-primary-foreground shadow'
                            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
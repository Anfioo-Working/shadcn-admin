import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Tag,
  Eye,
  Package,
  AlertTriangle,
} from 'lucide-react'
import { detailRows, dimensionTabs } from '../data/dashboard-data'
import { cn } from '@/lib/utils'

const statusVariants: Record<string, string> = {
  '已完成': 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400',
  '待发货': 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400',
  '运输中': 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-400',
  '已退款': 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400',
  '已取消': 'border-muted-foreground/20 bg-muted text-muted-foreground',
}

export function DimensionTabs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState('20')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredData = useMemo(() => {
    let data = detailRows.filter(
      (row) =>
        row.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.orderNo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    data = [...data].sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a]
      const bVal = b[sortBy as keyof typeof b]
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })

    return data
  }, [searchTerm, sortBy, sortOrder])

  const size = parseInt(pageSize)
  const totalPages = Math.ceil(filteredData.length / size)
  const pageData = filteredData.slice(
    (currentPage - 1) * size,
    currentPage * size
  )

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <CardTitle>明细数据分析</CardTitle>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='搜索商品/SKU/订单号...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className='h-9 w-[220px] pl-8'
              />
            </div>
            <Button variant='outline' size='sm' className='gap-1.5'>
              <Download className='h-4 w-4' />
              导出
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='orders'>
          <TabsList className='mb-4'>
            {dimensionTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {dimensionTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className='mb-3 flex items-center gap-2 overflow-x-auto'>
                <span className='text-xs text-muted-foreground'>排序:</span>
                <Button
                  variant={sortBy === 'amount' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-7 text-xs'
                  onClick={() => handleSort('amount')}
                >
                  销售额 {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <Button
                  variant={sortBy === 'quantity' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-7 text-xs'
                  onClick={() => handleSort('quantity')}
                >
                  销量 {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <Button
                  variant={sortBy === 'conversionRate' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-7 text-xs'
                  onClick={() => handleSort('conversionRate')}
                >
                  转化率 {sortBy === 'conversionRate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <Button
                  variant={sortBy === 'profit' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-7 text-xs'
                  onClick={() => handleSort('profit')}
                >
                  利润 {sortBy === 'profit' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </div>

              <div className='overflow-x-auto rounded-lg border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[100px]'>订单号</TableHead>
                      <TableHead className='min-w-[180px]'>商品名称</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>渠道</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead className='text-right'>数量</TableHead>
                      <TableHead className='text-right'>金额</TableHead>
                      <TableHead className='text-right'>利润</TableHead>
                      <TableHead className='text-right'>退款率</TableHead>
                      <TableHead className='text-right'>转化率</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead className='text-right'>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageData.map((row) => (
                      <TableRow
                        key={row.id}
                        className={cn(
                          row.refundRate > 15 && 'bg-red-50/50 dark:bg-red-950/20',
                          row.profit < 0 && 'bg-red-50/50 dark:bg-red-950/20',
                          row.conversionRate < 1 && 'bg-amber-50/50 dark:bg-amber-950/20'
                        )}
                      >
                        <TableCell className='font-mono text-xs'>
                          {row.orderNo}
                        </TableCell>
                        <TableCell className='font-medium'>
                          {row.product}
                        </TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground'>
                          {row.sku}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline' className='text-xs'>
                            {row.channel}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-xs'>{row.category}</TableCell>
                        <TableCell className='text-right'>{row.quantity}</TableCell>
                        <TableCell className='text-right font-medium'>
                          ¥{row.amount.toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-medium',
                            row.profit < 0 ? 'text-red-500' : 'text-emerald-600'
                          )}
                        >
                          {row.profit < 0 ? '-' : ''}¥{Math.abs(row.profit).toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right text-xs',
                            row.refundRate > 15 && 'font-semibold text-red-500'
                          )}
                        >
                          {row.refundRate > 15 && (
                            <AlertTriangle className='mr-0.5 inline h-3 w-3' />
                          )}
                          {row.refundRate}%
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right text-xs',
                            row.conversionRate < 1 && 'text-amber-500'
                          )}
                        >
                          {row.conversionRate}%
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={cn('text-xs', statusVariants[row.status])}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-xs text-muted-foreground'>
                          {row.date}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7'
                              title='查看商品详情'
                            >
                              <Eye className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7'
                              title='查看库存'
                            >
                              <Package className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7'
                              title='标记商品'
                            >
                              <Tag className='h-3.5 w-3.5' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 分页 */}
              <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span>共 {filteredData.length} 条</span>
                  <span>|</span>
                  <span>每页</span>
                  <Select value={pageSize} onValueChange={setPageSize}>
                    <SelectTrigger className='h-7 w-[70px] text-xs'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='20'>20条</SelectItem>
                      <SelectItem value='50'>50条</SelectItem>
                      <SelectItem value='100'>100条</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <span className='text-xs text-muted-foreground'>
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

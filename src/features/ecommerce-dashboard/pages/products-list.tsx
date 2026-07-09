import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { detailRows, categoryOptions, channels_filter } from '@/features/ecommerce-dashboard/data/dashboard-data'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

const PAGE_SIZE = 10

export function ProductsListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全品类')
  const [selectedChannel, setSelectedChannel] = useState('全渠道')
  const [currentPage, setCurrentPage] = useState(1)

  // 过滤数据
  const filteredData = useMemo(() => {
    return detailRows.filter((row) => {
      const matchesSearch = row.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '全品类' || row.category === selectedCategory
      const matchesChannel = selectedChannel === '全渠道' || row.channel === selectedChannel
      return matchesSearch && matchesCategory && matchesChannel
    })
  }, [searchTerm, selectedCategory, selectedChannel])

  // 分页数据
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredData.slice(start, start + PAGE_SIZE)
  }, [filteredData, currentPage])

  // 当筛选条件改变时重置页码
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleChannelChange = (value: string) => {
    setSelectedChannel(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // 状态颜色映射
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
      '已完成': { variant: 'default', className: 'bg-green-500/10 text-green-600 border-green-200' },
      '待发货': { variant: 'secondary', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
      '运输中': { variant: 'secondary', className: 'bg-blue-500/10 text-blue-600 border-blue-200' },
      '已退款': { variant: 'destructive' },
      '已取消': { variant: 'outline' },
    }
    const config = statusConfig[status] || { variant: 'outline' }
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">商品列表</h1>
      </Header>
      <Main>
        <div className="space-y-4">
          {/* 搜索和筛选栏 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-4">
              {/* 搜索框 */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索商品名或SKU..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* 筛选下拉 */}
            <div className="flex items-center gap-3">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedChannel} onValueChange={handleChannelChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="渠道" />
                </SelectTrigger>
                <SelectContent>
                  {channels_filter.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 商品数据表格 */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">库存</TableHead>
                  <TableHead className="text-right">销量</TableHead>
                  <TableHead className="text-right">销售额</TableHead>
                  <TableHead className="text-right">利润</TableHead>
                  <TableHead className="text-right">退款率</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.product}</TableCell>
                      <TableCell className="text-muted-foreground">{row.sku}</TableCell>
                      <TableCell className="text-right">{Math.floor(row.quantity * 2.5)}</TableCell>
                      <TableCell className="text-right">{row.quantity}</TableCell>
                      <TableCell className="text-right">¥{row.amount.toLocaleString()}</TableCell>
                      <TableCell className={`text-right ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {row.profit >= 0 ? '+' : ''}¥{row.profit.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={row.refundRate > 15 ? 'text-red-600 font-medium' : ''}>
                          {row.refundRate}%
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="link" size="sm" className="h-auto p-0">
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                共 {filteredData.length} 条记录，第 {currentPage} / {totalPages} 页
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
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
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
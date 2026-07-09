import * as React from 'react'
import { faker } from '@faker-js/faker'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

faker.seed(88888)

// 预警数据类型
interface InventoryAlert {
  id: string
  productName: string
  sku: string
  currentStock: number
  safeStock: number
  shortage: number
  alertLevel: 'high' | 'medium' | 'low'
  suggestedAction: string
}

// 生成预警数据
const generateAlerts = (): InventoryAlert[] => {
  const productNames = [
    '无线蓝牙耳机 Pro',
    '智能手表 Series 8',
    '瑜伽垫加厚防滑',
    '便携充电宝 20000mAh',
    'LED智能台灯',
    '不锈钢保温杯 500ml',
    '透气运动跑鞋',
    '商务双肩背包',
    '硅胶手机壳 iPhone 15',
    '快充数据线 Type-C',
  ]

  const actions = [
    '立即补货',
    '安排补货',
    '监控库存',
    '联系供应商',
    '调整安全库存',
  ]

  return productNames.map((name) => {
    const safeStock = faker.number.int({ min: 100, max: 500 })
    const currentStock = faker.number.int({ min: 0, max: safeStock - 10 })
    const shortage = safeStock - currentStock

    // 根据缺口比例决定预警级别
    const shortageRatio = shortage / safeStock
    let alertLevel: 'high' | 'medium' | 'low'
    if (shortageRatio >= 0.8) {
      alertLevel = 'high'
    } else if (shortageRatio >= 0.5) {
      alertLevel = 'medium'
    } else {
      alertLevel = 'low'
    }

    return {
      id: faker.string.uuid(),
      productName: name,
      sku: `SKU-${faker.number.int({ min: 10000, max: 99999 })}`,
      currentStock,
      safeStock,
      shortage,
      alertLevel,
      suggestedAction: faker.helpers.arrayElement(actions),
    }
  })
}

const alertData = generateAlerts()

// 预警级别配置
const alertLevelConfig = {
  high: { label: '高', variant: 'destructive' as const },
  medium: { label: '中', variant: 'secondary' as const },
  low: { label: '低', variant: 'outline' as const },
}

// 过滤数据
const filterByLevel = (
  data: InventoryAlert[],
  level: 'all' | 'high' | 'medium' | 'low'
): InventoryAlert[] => {
  if (level === 'all') return data
  return data.filter((item) => item.alertLevel === level)
}

export function InventoryAlertsPage() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'high' | 'medium' | 'low'>('all')

  const filteredData = filterByLevel(alertData, activeTab)

  // 统计各级别数量
  const counts = {
    all: alertData.length,
    high: alertData.filter((item) => item.alertLevel === 'high').length,
    medium: alertData.filter((item) => item.alertLevel === 'medium').length,
    low: alertData.filter((item) => item.alertLevel === 'low').length,
  }

  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">补货预警</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 预警级别筛选 Tab */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          >
            <TabsList>
              <TabsTrigger value="all">
                全部 ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="high">
                高 ({counts.high})
              </TabsTrigger>
              <TabsTrigger value="medium">
                中 ({counts.medium})
              </TabsTrigger>
              <TabsTrigger value="low">
                低 ({counts.low})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 预警商品表格 */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品名</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">当前库存</TableHead>
                  <TableHead className="text-right">安全库存</TableHead>
                  <TableHead className="text-right">缺口</TableHead>
                  <TableHead className="text-center">预警级别</TableHead>
                  <TableHead>建议操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      暂无预警数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                      <TableCell className="text-right">{item.currentStock}</TableCell>
                      <TableCell className="text-right">{item.safeStock}</TableCell>
                      <TableCell className="text-right font-medium text-destructive">
                        {item.shortage}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={alertLevelConfig[item.alertLevel].variant}>
                          {alertLevelConfig[item.alertLevel].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          {item.suggestedAction}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Main>
    </>
  )
}
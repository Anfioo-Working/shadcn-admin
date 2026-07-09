import { faker } from '@faker-js/faker'

faker.seed(99999)

// ==================== 类型定义 ====================
export interface KpiData {
  label: string
  value: string
  subValue: string
  change: number
  changeType: 'up' | 'down'
  icon: string
  details: { label: string; value: string }[]
}

export interface SalesTrendItem {
  date: string
  gmv: number
  lastPeriod: number
}

export interface ChannelData {
  name: string
  value: number
  color: string
}

export interface FunnelData {
  stage: string
  value: number
  rate: string
}

export interface HotProduct {
  rank: number
  name: string
  sku: string
  sales: number
  revenue: number
  trend: 'up' | 'down' | 'same'
  rankChange: number
}

export interface AdRoiData {
  date: string
  adSpend: number
  gmv: number
  roi: number
}

export interface InventoryItem {
  category: string
  stock: number
  turnoverDays: number
  status: 'normal' | 'warning' | 'danger'
}

export interface DetailRow {
  id: string
  orderNo: string
  product: string
  sku: string
  channel: string
  category: string
  quantity: number
  amount: number
  profit: number
  status: string
  refundRate: number
  conversionRate: number
  date: string
}

export interface RiskAlert {
  type: 'refund' | 'inventory' | 'order' | 'channel'
  title: string
  description: string
  level: 'high' | 'medium' | 'low'
  action: string
}

// ==================== KPI 数据 ====================
export const kpiCards: KpiData[] = [
  {
    label: '交易总额 GMV',
    value: '¥2,847,392',
    subValue: '实收 ¥2,693,021',
    change: 12.5,
    changeType: 'up',
    icon: 'dollar',
    details: [
      { label: '总销售额', value: '¥2,847,392' },
      { label: '退款金额', value: '¥154,371' },
      { label: '实收金额', value: '¥2,693,021' },
    ],
  },
  {
    label: '订单总数',
    value: '18,427',
    subValue: '有效 16,892',
    change: 8.3,
    changeType: 'up',
    icon: 'shopping-bag',
    details: [
      { label: '总订单', value: '18,427' },
      { label: '有效订单', value: '16,892' },
      { label: '取消订单', value: '1,535' },
      { label: '待发货', value: '2,108' },
    ],
  },
  {
    label: '访客 UV',
    value: '342,108',
    subValue: 'PV 1,287,433',
    change: 15.2,
    changeType: 'up',
    icon: 'users',
    details: [
      { label: '访客 UV', value: '342,108' },
      { label: '浏览 PV', value: '1,287,433' },
      { label: '加购人数', value: '48,732' },
      { label: '下单转化率', value: '5.39%' },
    ],
  },
  {
    label: '总毛利',
    value: '¥892,144',
    subValue: '毛利率 31.3%',
    change: -2.1,
    changeType: 'down',
    icon: 'trending-up',
    details: [
      { label: '总毛利', value: '¥892,144' },
      { label: '毛利率', value: '31.3%' },
      { label: '广告消耗', value: '¥234,507' },
      { label: '净盈利', value: '¥657,637' },
    ],
  },
  {
    label: '库存预警',
    value: '47',
    subValue: '缺货 SKU 12',
    change: -5,
    changeType: 'down',
    icon: 'package',
    details: [
      { label: '低库存商品', value: '47' },
      { label: '缺货 SKU', value: '12' },
      { label: '积压库存', value: '¥183,200' },
    ],
  },
]

// ==================== 销售趋势 ====================
export const salesTrendData: SalesTrendItem[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  return {
    date: `7/${day}`,
    gmv: faker.number.int({ min: 60000, max: 140000 }),
    lastPeriod: faker.number.int({ min: 50000, max: 120000 }),
  }
})

// ==================== 渠道销售占比 ====================
export const channelData: ChannelData[] = [
  { name: '独立站', value: 985200, color: '#6366f1' },
  { name: 'TikTok小店', value: 743100, color: '#ec4899' },
  { name: '亚马逊', value: 521700, color: '#f59e0b' },
  { name: '抖音商城', value: 387400, color: '#06b6d4' },
  { name: '小程序', value: 209992, color: '#10b981' },
]

// ==================== 转化漏斗 ====================
export const funnelData: FunnelData[] = [
  { stage: '访客浏览', value: 342108, rate: '100%' },
  { stage: '加购', value: 48732, rate: '14.2%' },
  { stage: '提交订单', value: 21951, rate: '6.4%' },
  { stage: '支付成功', value: 18427, rate: '5.4%' },
  { stage: '确认收货', value: 16208, rate: '4.7%' },
]

// ==================== 热销商品 TOP20 ====================
export const hotProducts: HotProduct[] = Array.from({ length: 20 }, (_, i) => {
  const categories = ['无线蓝牙耳机', '智能手表', '瑜伽垫', '便携充电宝', 'LED台灯',
    '保温杯', '运动鞋', '背包', '手机壳', '数据线',
    '蓝牙音箱', '电动牙刷', '按摩枪', '防晒衣', '速干T恤',
    '收纳盒', '加湿器', '厨房刀具', '汽车香薰', '宠物自动喂食器']
  return {
    rank: i + 1,
    name: categories[i],
    sku: `SKU-${faker.number.int({ min: 10000, max: 99999 })}`,
    sales: faker.number.int({ min: 500, max: 8000 }),
    revenue: faker.number.int({ min: 20000, max: 500000 }),
    trend: faker.helpers.arrayElement(['up', 'down', 'same'] as const),
    rankChange: faker.number.int({ min: -3, max: 5 }),
  }
})

// ==================== 广告ROI ====================
export const adRoiData: AdRoiData[] = Array.from({ length: 14 }, (_, i) => ({
  date: `7/${i + 1}`,
  adSpend: faker.number.int({ min: 8000, max: 25000 }),
  gmv: faker.number.int({ min: 30000, max: 120000 }),
  roi: faker.number.float({ min: 1.5, max: 6.5, fractionDigits: 2 }),
}))

// ==================== 库存周转 ====================
export const inventoryData: InventoryItem[] = [
  { category: '服装', stock: 12400, turnoverDays: 32, status: 'normal' },
  { category: '3C数码', stock: 8200, turnoverDays: 18, status: 'normal' },
  { category: '家居', stock: 15600, turnoverDays: 65, status: 'danger' },
  { category: '工具', stock: 4300, turnoverDays: 45, status: 'warning' },
  { category: '美妆', stock: 6800, turnoverDays: 22, status: 'normal' },
  { category: '食品', stock: 3200, turnoverDays: 12, status: 'normal' },
  { category: '运动户外', stock: 9100, turnoverDays: 78, status: 'danger' },
]

// ==================== 明细表格 ====================
const channels = ['独立站', 'TikTok小店', '亚马逊', '抖音商城', '小程序']
const categories = ['服装', '3C数码', '家居', '工具', '美妆']
const statuses = ['已完成', '待发货', '运输中', '已退款', '已取消']
const productNames = [
  '无线蓝牙耳机 Pro Max', '智能手表 Series 8', '瑜伽垫加厚防滑', '便携充电宝 20000mAh',
  'LED智能台灯', '不锈钢保温杯 500ml', '透气运动跑鞋', '商务双肩背包',
  '硅胶手机壳 iPhone 15', '快充数据线 Type-C', '便携蓝牙音箱', '声波电动牙刷',
  '筋膜枪按摩器', 'UPF50+防晒衣', '速干运动T恤', '透明收纳盒套装',
  '超声波加湿器', '不锈钢厨房刀具', '车载固体香薰', '智能宠物喂食器',
]

export const detailRows: DetailRow[] = Array.from({ length: 100 }, () => {
  const refundRate = faker.number.float({ min: 0, max: 25, fractionDigits: 1 })
  const conversionRate = faker.number.float({ min: 0.5, max: 12, fractionDigits: 2 })
  return {
    id: faker.string.uuid(),
    orderNo: `ORD-${faker.number.int({ min: 100000, max: 999999 })}`,
    product: faker.helpers.arrayElement(productNames),
    sku: `SKU-${faker.number.int({ min: 10000, max: 99999 })}`,
    channel: faker.helpers.arrayElement(channels),
    category: faker.helpers.arrayElement(categories),
    quantity: faker.number.int({ min: 1, max: 50 }),
    amount: faker.number.int({ min: 50, max: 8000 }),
    profit: faker.number.int({ min: -200, max: 3500 }),
    status: faker.helpers.arrayElement(statuses),
    refundRate,
    conversionRate,
    date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
  }
})

// ==================== 风险预警 ====================
export const riskAlerts: RiskAlert[] = [
  {
    type: 'refund',
    title: '高退款率商品提醒',
    description: '「便携充电宝 20000mAh」退款率达 18.3%，超过阈值 15%，近7天退款 47单',
    level: 'high',
    action: '查看详情',
  },
  {
    type: 'inventory',
    title: '库存预警',
    description: '12个SKU已缺货，47个商品低于安全库存，「家居」品类积压库存价值 ¥183,200',
    level: 'high',
    action: '立即补货',
  },
  {
    type: 'order',
    title: '异常订单提醒',
    description: '检测到3笔大额取消订单（>¥5,000），疑似恶意下单，订单号: ORD-487231, ORD-487456, ORD-487892',
    level: 'medium',
    action: '审核订单',
  },
  {
    type: 'channel',
    title: '渠道亏损提醒',
    description: '「抖音商城」渠道ROI降至 1.2，低于阈值 1.5，近7天广告消耗 ¥34,200，亏损 ¥5,800',
    level: 'medium',
    action: '调整策略',
  },
]

// ==================== 筛选选项 ====================
export const timeRanges = ['今日', '昨日', '近7天', '近30天', '自然月', '自定义']
export const channels_filter = ['全渠道', '独立站', 'TikTok小店', '亚马逊', '抖音商城', '小程序']
export const categoryOptions = ['全品类', '服装', '3C数码', '家居', '工具', '美妆']
export const stores = ['全部店铺', '品牌旗舰一店', '跨境专营店', 'TikTok全球店', '亚马逊US店']
export const currencies = ['CNY ¥', 'USD $', 'EUR €']
export const refreshIntervals = ['关闭', '5分钟', '10分钟', '30分钟']

// ==================== Tab 维度数据 ====================
export const dimensionTabs = [
  { id: 'orders', label: '订单分析' },
  { id: 'products', label: '商品销量分析' },
  { id: 'traffic', label: '流量来源分析' },
  { id: 'ads', label: '广告投放分析' },
  { id: 'inventory', label: '库存仓储分析' },
  { id: 'aftersales', label: '售后退款分析' },
]

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { FilterBar } from './components/filter-bar'
import { KpiCards } from './components/kpi-cards'
import { SalesTrendChart } from './components/sales-trend-chart'
import { ChannelPieChart } from './components/channel-pie-chart'
import { ConversionFunnel } from './components/conversion-funnel'
import { HotProductsChart } from './components/hot-products-chart'
import { AdRoiChart } from './components/ad-roi-chart'
import { InventoryChart } from './components/inventory-chart'
import { DimensionTabs } from './components/dimension-tabs'
import { RiskAlerts } from './components/risk-alerts'
import { ExportBar } from './components/export-bar'

export function EcommerceDashboard() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-5'>
        {/* 页面标题 */}
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              电商数据中心
            </h2>
            <p className='text-muted-foreground'>
              多渠道电商运营数据看板 · 跨境/国内电商全适配 · 数据实时联动
            </p>
          </div>
        </div>

        {/* 1. 顶部全局筛选 */}
        <FilterBar />

        {/* 2. 核心KPI指标卡片 */}
        <KpiCards />

        {/* 3. 趋势图表板块 - 第一行 */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='col-span-1 lg:col-span-4'>
            <SalesTrendChart />
          </div>
          <div className='col-span-1 lg:col-span-3'>
            <ChannelPieChart />
          </div>
        </div>

        {/* 3. 趋势图表板块 - 第二行 */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='col-span-1 lg:col-span-3'>
            <ConversionFunnel />
          </div>
          <div className='col-span-1 lg:col-span-4'>
            <HotProductsChart />
          </div>
        </div>

        {/* 3. 趋势图表板块 - 第三行 */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='col-span-1 lg:col-span-4'>
            <AdRoiChart />
          </div>
          <div className='col-span-1 lg:col-span-3'>
            <InventoryChart />
          </div>
        </div>

        {/* 6. 售后 & 风险预警 */}
        <RiskAlerts />

        {/* 4 & 5. 维度Tab + 明细数据表格 */}
        <DimensionTabs />

        {/* 7. 导出 & 报表功能 */}
        <ExportBar />

        {/* 底部信息 */}
        <div className='flex items-center justify-center gap-4 pb-4 text-xs text-muted-foreground'>
          <span>SaaS 多租户电商数据看板</span>
          <span>·</span>
          <span>支持跨境/国内电商</span>
          <span>·</span>
          <span>数据权限隔离 · 操作日志记录</span>
          <span>·</span>
          <span>暗黑/浅色模式自适应</span>
        </div>
      </Main>
    </>
  )
}

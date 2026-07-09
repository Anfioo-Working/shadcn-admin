import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { FilterBar } from '@/features/ecommerce-dashboard/components/filter-bar'
import { KpiCards } from '@/features/ecommerce-dashboard/components/kpi-cards'
import { SalesTrendChart } from '@/features/ecommerce-dashboard/components/sales-trend-chart'
import { ChannelPieChart } from '@/features/ecommerce-dashboard/components/channel-pie-chart'
import { ConversionFunnel } from '@/features/ecommerce-dashboard/components/conversion-funnel'
import { RiskAlerts } from '@/features/ecommerce-dashboard/components/risk-alerts'

export function EcommerceOverview() {
  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">数据概览</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 顶部筛选栏 */}
          <FilterBar />

          {/* KPI 卡片行 */}
          <KpiCards />

          {/* 两列图表：销售趋势 + 渠道占比 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SalesTrendChart />
            <ChannelPieChart />
          </div>

          {/* 转化漏斗 */}
          <ConversionFunnel />

          {/* 风险预警 */}
          <RiskAlerts />
        </div>
      </Main>
    </>
  )
}
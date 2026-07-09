import { createContext, useContext, type ReactNode } from 'react'
import { create } from 'zustand'

// ==================== 类型定义 ====================

/**
 * 筛选状态类型
 */
export interface FilterState {
  /** 时间范围 */
  timeRange: string
  /** 渠道 */
  channel: string
  /** 商品分类 */
  category: string
  /** 店铺 */
  store: string
  /** 币种 */
  currency: string
  /** 自动刷新间隔 */
  refreshInterval: string
}

/**
 * 筛选操作类型
 */
export interface FilterActions {
  /** 设置时间范围 */
  setTimeRange: (timeRange: string) => void
  /** 设置渠道 */
  setChannel: (channel: string) => void
  /** 设置商品分类 */
  setCategory: (category: string) => void
  /** 设置店铺 */
  setStore: (store: string) => void
  /** 设置币种 */
  setCurrency: (currency: string) => void
  /** 设置自动刷新间隔 */
  setRefreshInterval: (refreshInterval: string) => void
  /** 重置所有筛选条件 */
  resetFilters: () => void
  /** 批量设置筛选条件 */
  setFilters: (filters: Partial<FilterState>) => void
}

/**
 * 筛选 Store 类型
 */
export type FilterStore = FilterState & FilterActions

/**
 * 默认筛选值
 */
const DEFAULT_FILTER_VALUES: FilterState = {
  timeRange: '近7天',
  channel: '全渠道',
  category: '全品类',
  store: '全部店铺',
  currency: 'CNY ¥',
  refreshInterval: '关闭',
}

// ==================== Zustand Store ====================

/**
 * 创建筛选状态 Store
 */
const useFilterStore = create<FilterStore>((set) => ({
  // 默认值
  ...DEFAULT_FILTER_VALUES,

  // Actions
  setTimeRange: (timeRange) => set({ timeRange }),
  setChannel: (channel) => set({ channel }),
  setCategory: (category) => set({ category }),
  setStore: (store) => set({ store }),
  setCurrency: (currency) => set({ currency }),
  setRefreshInterval: (refreshInterval) => set({ refreshInterval }),

  // 重置所有筛选条件
  resetFilters: () => set(DEFAULT_FILTER_VALUES),

  // 批量设置筛选条件
  setFilters: (filters) => set(filters),
}))

// ==================== React Context ====================

/**
 * 筛选上下文类型
 */
interface FilterContextValue {
  /** 获取当前筛选状态 */
  getState: () => FilterState
  /** 设置筛选状态的 Hook */
  useStore: typeof useFilterStore
}

const FilterContext = createContext<FilterContextValue | null>(null)

// ==================== Provider ====================

interface FilterProviderProps {
  children: ReactNode
  /** 初始筛选值（可选） */
  initialFilters?: Partial<FilterState>
}

/**
 * 筛选上下文 Provider 组件
 * 为电商看板提供全局筛选状态管理
 */
export function FilterProvider({ children, initialFilters }: FilterProviderProps) {
  // 如果提供了初始值，则初始化 Store
  if (initialFilters) {
    useFilterStore.setState(initialFilters)
  }

  const contextValue: FilterContextValue = {
    getState: () => useFilterStore.getState(),
    useStore: useFilterStore,
  }

  return (
    <FilterContext value={contextValue}>
      {children}
    </FilterContext>
  )
}

// ==================== Hook ====================

/**
 * 电商看板筛选 Hook
 * 用于访问和修改全局筛选状态
 *
 * @example
 * ```tsx
 * const { timeRange, setTimeRange, resetFilters } = useEcommerceFilter()
 *
 * // 读取当前时间范围
 * console.log(timeRange)
 *
 * // 设置时间范围
 * setTimeRange('近30天')
 *
 * // 重置所有筛选
 * resetFilters()
 * ```
 */
export function useEcommerceFilter(): FilterStore {
  const context = useContext(FilterContext)

  if (!context) {
    throw new Error('useEcommerceFilter must be used within a FilterProvider')
  }

  // 使用 Zustand Store Hook 获取完整的状态和操作
  return context.useStore()
}

/**
 * 获取当前筛选状态的 Hook（只读）
 * 不订阅状态变化，适用于一次性获取状态
 */
export function useEcommerceFilterState(): FilterState {
  const { timeRange, channel, category, store, currency, refreshInterval } = useEcommerceFilter()
  return { timeRange, channel, category, store, currency, refreshInterval }
}

/**
 * 获取筛选操作的 Hook（只操作）
 * 不订阅状态变化，适用于只需要修改状态的场景
 */
export function useEcommerceFilterActions(): FilterActions {
  const store = useEcommerceFilter()
  return {
    setTimeRange: store.setTimeRange,
    setChannel: store.setChannel,
    setCategory: store.setCategory,
    setStore: store.setStore,
    setCurrency: store.setCurrency,
    setRefreshInterval: store.setRefreshInterval,
    resetFilters: store.resetFilters,
    setFilters: store.setFilters,
  }
}

// ==================== 工具函数 ====================

/**
 * 获取当前筛选状态（非 Hook 方式）
 * 可在 React 组件外部使用
 */
export function getFilterState(): FilterState {
  const state = useFilterStore.getState()
  return {
    timeRange: state.timeRange,
    channel: state.channel,
    category: state.category,
    store: state.store,
    currency: state.currency,
    refreshInterval: state.refreshInterval,
  }
}

/**
 * 直接设置筛选状态（非 Hook 方式）
 * 可在 React 组件外部使用
 */
export function setFilterState(filters: Partial<FilterState>): void {
  useFilterStore.setState(filters)
}

/**
 * 直接重置筛选状态（非 Hook 方式）
 * 可在 React 组件外部使用
 */
export function resetFilterState(): void {
  useFilterStore.setState(DEFAULT_FILTER_VALUES)
}
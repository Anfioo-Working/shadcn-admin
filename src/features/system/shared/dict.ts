/**
 * 系统管理模块 - 字典数据
 * System Management Module - Dictionary Data
 */

// ==================== 字典数据定义 ====================

/** 系统正常/停用 */
export const sys_normal_disable = [
  { value: '0', label: '正常' },
  { value: '1', label: '停用' },
]

/** 系统是/否 */
export const sys_yes_no = [
  { value: 'Y', label: '是' },
  { value: 'N', label: '否' },
]

/** 用户性别 */
export const sys_user_sex = [
  { value: '0', label: '男' },
  { value: '1', label: '女' },
  { value: '2', label: '未知' },
]

/** 通知类型 */
export const sys_notice_type = [
  { value: '1', label: '通知' },
  { value: '2', label: '公告' },
]

/** 通知状态 */
export const sys_notice_status = [
  { value: '0', label: '正常' },
  { value: '1', label: '关闭' },
]

/** 菜单显示/隐藏 */
export const sys_show_hide = [
  { value: '0', label: '显示' },
  { value: '1', label: '隐藏' },
]

/** 菜单类型 */
export const sys_menu_type = [
  { value: 'M', label: '目录' },
  { value: 'C', label: '菜单' },
  { value: 'F', label: '按钮' },
]

/** 系统缓存 */
export const sys_cache = [
  { value: '0', label: '缓存' },
  { value: '1', label: '不缓存' },
]

/** 是否外链 */
export const sys_is_frame = [
  { value: '0', label: '否' },
  { value: '1', label: '是' },
]

/** 数据范围 */
export const sys_data_scope = [
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定义数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
]

/** 部门类别 */
export const sys_dept_category = [
  { value: 'company', label: '公司' },
  { value: 'department', label: '部门' },
  { value: 'group', label: '小组' },
]

/** 岗位类别 */
export const sys_post_category = [
  { value: 'management', label: '管理' },
  { value: 'technical', label: '技术' },
  { value: 'operation', label: '运营' },
  { value: 'support', label: '支持' },
]

/** 系统内置 */
export const sys_config_type = [
  { value: 'Y', label: '是' },
  { value: 'N', label: '否' },
]

/** 样式类型 - 用于字典数据 */
export const sys_dict_list_class = [
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
]

// ==================== 类型定义 ====================

export interface DictItem {
  value: string
  label: string
}

type DictType =
  | 'sys_normal_disable'
  | 'sys_yes_no'
  | 'sys_user_sex'
  | 'sys_notice_type'
  | 'sys_notice_status'
  | 'sys_show_hide'
  | 'sys_menu_type'
  | 'sys_cache'
  | 'sys_is_frame'
  | 'sys_data_scope'
  | 'sys_dept_category'
  | 'sys_post_category'
  | 'sys_config_type'
  | 'sys_dict_list_class'

// ==================== 字典映射 ====================

const dictMap: Record<DictType, DictItem[]> = {
  sys_normal_disable,
  sys_yes_no,
  sys_user_sex,
  sys_notice_type,
  sys_notice_status,
  sys_show_hide,
  sys_menu_type,
  sys_cache,
  sys_is_frame,
  sys_data_scope,
  sys_dept_category,
  sys_post_category,
  sys_config_type,
  sys_dict_list_class,
}

// ==================== 辅助函数 ====================

/**
 * 根据字典类型和值获取标签
 * @param type 字典类型
 * @param value 字典值
 * @returns 对应的标签，如果未找到则返回原值
 */
export function getDictLabel(type: DictType, value: string): string {
  const dict = dictMap[type]
  if (!dict) return value
  const item = dict.find((d) => d.value === value)
  return item ? item.label : value
}

/**
 * 根据字典类型获取字典列表
 * @param type 字典类型
 * @returns 字典列表
 */
export function getDictList(type: DictType): DictItem[] {
  return dictMap[type] || []
}

/**
 * 根据字典类型和标签获取值
 * @param type 字典类型
 * @param label 字典标签
 * @returns 对应的值，如果未找到则返回空字符串
 */
export function getDictValue(type: DictType, label: string): string {
  const dict = dictMap[type]
  if (!dict) return ''
  const item = dict.find((d) => d.label === label)
  return item ? item.value : ''
}

/**
 * 检查字典值是否有效
 * @param type 字典类型
 * @param value 字典值
 * @returns 是否存在
 */
export function isValidDictValue(type: DictType, value: string): boolean {
  const dict = dictMap[type]
  if (!dict) return false
  return dict.some((d) => d.value === value)
}

/**
 * 获取字典默认值（第一项）
 * @param type 字典类型
 * @returns 默认值
 */
export function getDictDefaultValue(type: DictType): string {
  const dict = dictMap[type]
  if (!dict || dict.length === 0) return ''
  return dict[0].value
}

/**
 * 系统管理模块 - 类型定义
 * System Management Module - Type Definitions
 */

// ==================== 用户 (User) ====================

export interface User {
  /** 用户ID */
  userId: number
  /** 部门ID */
  deptId: number
  /** 用户名 */
  userName: string
  /** 用户昵称 */
  nickName: string
  /** 用户邮箱 */
  email: string
  /** 手机号码 */
  phonenumber: string
  /** 用户性别 (0=男, 1=女, 2=未知) */
  sex: string
  /** 帐号状态 (0=正常, 1=停用) */
  status: string
  /** 创建者 */
  createByName: string
  /** 创建时间 */
  createTime: string
  /** 更新者 */
  updateByName: string
  /** 更新时间 */
  updateTime: string
  /** 备注 */
  remark: string
  /** 删除标志 (0=存在, 1=删除) */
  delFlag: string
  /** 头像地址 */
  avatar: string
  /** 部门信息 */
  dept?: Dept
  /** 角色ID列表 */
  roles?: number[]
  /** 岗位ID列表 */
  posts?: number[]
}

export interface UserQuery {
  pageNum?: number
  pageSize?: number
  userName?: string
  nickName?: string
  phonenumber?: string
  status?: string
  deptId?: number
  beginTime?: string
  endTime?: string
}

export interface UserForm {
  userId?: number
  deptId: number
  userName: string
  nickName: string
  password?: string
  email: string
  phonenumber: string
  sex: string
  status: string
  remark: string
  roleIds: number[]
  postIds: number[]
}

// ==================== 角色 (Role) ====================

export interface Role {
  /** 角色ID */
  roleId: number
  /** 角色名称 */
  roleName: string
  /** 角色权限字符串 */
  roleKey: string
  /** 显示顺序 */
  roleSort: number
  /** 数据范围 (1=全部数据权限, 2=自定义数据权限, 3=本部门数据权限, 4=本部门及以下数据权限, 5=仅本人数据权限) */
  dataScope: string
  /** 数据范围部门ID列表 */
  dataScopeDeptIds?: number[]
  /** 角色状态 (0=正常, 1=停用) */
  status: string
  /** 创建者 */
  createByName: string
  /** 创建时间 */
  createTime: string
  /** 更新者 */
  updateByName: string
  /** 更新时间 */
  updateTime: string
  /** 备注 */
  remark: string
  /** 删除标志 (0=存在, 1=删除) */
  delFlag: string
  /** 菜单树选择项是否关联显示 */
  menuCheckStrictly: boolean
  /** 部门树选择项是否关联显示 */
  deptCheckStrictly: boolean
  /** 菜单组 */
  menuIds?: number[]
  /** 部门组 */
  deptIds?: number[]
}

export interface RoleQuery {
  pageNum?: number
  pageSize?: number
  roleName?: string
  roleKey?: string
  status?: string
  beginTime?: string
  endTime?: string
}

export interface RoleForm {
  roleId?: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope: string
  status: string
  remark: string
  menuIds: number[]
  deptIds: number[]
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
}

// ==================== 菜单 (Menu) ====================

export interface Menu {
  /** 菜单ID */
  menuId: number
  /** 菜单名称 */
  menuName: string
  /** 父菜单ID */
  parentId: number
  /** 显示顺序 */
  orderNum: number
  /** 路由地址 */
  path: string
  /** 组件路径 */
  component: string
  /** 路由参数 */
  queryParam: string
  /** 是否为外链 (0=否, 1=是) */
  isFrame: string
  /** 是否缓存 (0=缓存, 1=不缓存) */
  isCache: string
  /** 菜单类型 (M=目录, C=菜单, F=按钮) */
  menuType: string
  /** 显示状态 (0=显示, 1=隐藏) */
  visible: string
  /** 菜单状态 (0=正常, 1=停用) */
  status: string
  /** 权限标识 */
  perms: string
  /** 菜单图标 */
  icon: string
  /** 创建者 */
  createByName: string
  /** 创建时间 */
  createTime: string
  /** 更新者 */
  updateByName: string
  /** 更新时间 */
  updateTime: string
  /** 备注 */
  remark: string
  /** 删除标志 (0=存在, 1=删除) */
  delFlag: string
  /** 子菜单 */
  children?: Menu[]
}

export interface MenuQuery {
  menuName?: string
  status?: string
}

export interface MenuForm {
  menuId?: number
  menuName: string
  parentId: number
  orderNum: number
  path: string
  component: string
  queryParam: string
  isFrame: string
  isCache: string
  menuType: string
  visible: string
  status: string
  perms: string
  icon: string
  remark: string
}

export interface MenuTreeSelect {
  id: number
  label: string
  children?: MenuTreeSelect[]
}

// ==================== 部门 (Dept) ====================

export interface Dept {
  /** 部门ID */
  deptId: number
  /** 父部门ID */
  parentId: number
  /** 部门名称 */
  deptName: string
  /** 部门类别 */
  deptCategory: string
  /** 显示顺序 */
  orderNum: number
  /** 负责人 */
  leader: string
  /** 联系电话 */
  phone: string
  /** 邮箱 */
  email: string
  /** 部门状态 (0=正常, 1=停用) */
  status: string
  /** 创建者 */
  createByName: string
  /** 创建时间 */
  createTime: string
  /** 更新者 */
  updateByName: string
  /** 更新时间 */
  updateTime: string
  /** 备注 */
  remark: string
  /** 删除标志 (0=存在, 1=删除) */
  delFlag: string
  /** 子部门 */
  children?: Dept[]
  /** 父部门名称 */
  parentName?: string
}

export interface DeptQuery {
  deptName?: string
  status?: string
}

export interface DeptForm {
  deptId?: number
  parentId: number
  deptName: string
  deptCategory: string
  orderNum: number
  leader: string
  phone: string
  email: string
  status: string
  remark: string
}

// ==================== 岗位 (Post) ====================

export interface Post {
  /** 岗位ID */
  postId: number
  /** 部门ID */
  deptId: number
  /** 部门名称 */
  deptName: string
  /** 岗位编码 */
  postCode: string
  /** 岗位类别 */
  postCategory: string
  /** 岗位名称 */
  postName: string
  /** 显示顺序 */
  postSort: number
  /** 状态 (0=正常, 1=停用) */
  status: string
  /** 创建者 */
  createByName: string
  /** 创建时间 */
  createTime: string
  /** 更新者 */
  updateByName: string
  /** 更新时间 */
  updateTime: string
  /** 备注 */
  remark: string
  /** 删除标志 (0=存在, 1=删除) */
  delFlag: string
}

export interface PostQuery {
  pageNum?: number
  pageSize?: number
  postCode?: string
  postName?: string
  postCategory?: string
  status?: string
  deptId?: number
}

export interface PostForm {
  postId?: number
  deptId: number
  postCode: string
  postCategory: string
  postName: string
  postSort: number
  status: string
  remark: string
}

// ==================== 字典类型 (DictType) ====================

export interface DictType {
  /** 字典主键 */
  dictId: number
  /** 字典名称 */
  dictName: string
  /** 字典类型 */
  dictType: string
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
}

export interface DictTypeQuery {
  pageNum?: number
  pageSize?: number
  dictName?: string
  dictType?: string
  status?: string
}

export interface DictTypeForm {
  dictId?: number
  dictName: string
  dictType: string
  remark: string
}

// ==================== 字典数据 (DictData) ====================

export interface DictData {
  /** 字典编码 */
  dictCode: number
  /** 字典类型 */
  dictType: string
  /** 字典标签 */
  dictLabel: string
  /** 字典键值 */
  dictValue: string
  /** 样式属性 */
  cssClass: string
  /** 表格回显样式 */
  listClass: string
  /** 字典排序 */
  dictSort: number
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
}

export interface DictDataQuery {
  pageNum?: number
  pageSize?: number
  dictType?: string
  dictLabel?: string
  status?: string
}

export interface DictDataForm {
  dictCode?: number
  dictType: string
  dictLabel: string
  dictValue: string
  cssClass: string
  listClass: string
  dictSort: number
  remark: string
}

// ==================== 系统配置 (Config) ====================

export interface Config {
  /** 参数主键 */
  configId: number
  /** 参数名称 */
  configName: string
  /** 参数键名 */
  configKey: string
  /** 参数键值 */
  configValue: string
  /** 系统内置 (Y=是, N=否) */
  configType: string
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
}

export interface ConfigQuery {
  pageNum?: number
  pageSize?: number
  configName?: string
  configKey?: string
  configType?: string
}

export interface ConfigForm {
  configId?: number
  configName: string
  configKey: string
  configValue: string
  configType: string
  remark: string
}

// ==================== 通知公告 (Notice) ====================

export interface Notice {
  /** 公告ID */
  noticeId: number
  /** 公告标题 */
  noticeTitle: string
  /** 公告类型 (1=通知, 2=公告) */
  noticeType: string
  /** 公告内容 */
  noticeContent: string
  /** 公告状态 (0=正常, 1=关闭) */
  status: string
  /** 创建者 */
  createByName: string
  /** 创建时间 */
  createTime: string
  /** 备注 */
  remark: string
}

export interface NoticeQuery {
  pageNum?: number
  pageSize?: number
  noticeTitle?: string
  noticeType?: string
  status?: string
}

export interface NoticeForm {
  noticeId?: number
  noticeTitle: string
  noticeType: string
  noticeContent: string
  status: string
  remark: string
}

// ==================== 通用响应类型 ====================

export interface ApiResult<T> {
  code: number
  msg: string
  data: T
}

export interface PageResult<T> {
  rows: T[]
  total: number
}

export interface TreeSelect {
  id: number
  label: string
  children?: TreeSelect[]
}

// ==================== 其他辅助类型 ====================

export interface RoleOption {
  roleId: number
  roleName: string
}

export interface PostOption {
  postId: number
  postName: string
  postCode: string
}

/**
 * 系统管理模块 - Mock API
 * System Management Module - Mock API
 */
import { sleep } from '@/lib/utils'
import type {
  User,
  UserQuery,
  UserForm,
  Role,
  RoleQuery,
  RoleForm,
  Menu,
  MenuQuery,
  MenuForm,
  MenuTreeSelect,
  Dept,
  DeptQuery,
  DeptForm,
  Post,
  PostQuery,
  PostForm,
  DictType,
  DictTypeQuery,
  DictTypeForm,
  DictData,
  DictDataQuery,
  DictDataForm,
  Config,
  ConfigQuery,
  ConfigForm,
  Notice,
  NoticeQuery,
  NoticeForm,
  ApiResult,
  PageResult,
  TreeSelect,
  RoleOption,
  PostOption,
} from './types'

// ==================== Mock 数据 ====================

// 部门数据
const mockDepts: Dept[] = [
  {
    deptId: 100,
    parentId: 0,
    deptName: '若依科技',
    deptCategory: 'company',
    orderNum: 0,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 101,
    parentId: 100,
    deptName: '深圳总公司',
    deptCategory: 'company',
    orderNum: 1,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 102,
    parentId: 101,
    deptName: '研发部门',
    deptCategory: 'department',
    orderNum: 1,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 103,
    parentId: 101,
    deptName: '市场部门',
    deptCategory: 'department',
    orderNum: 2,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 104,
    parentId: 101,
    deptName: '测试部门',
    deptCategory: 'department',
    orderNum: 3,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 105,
    parentId: 101,
    deptName: '财务部门',
    deptCategory: 'department',
    orderNum: 4,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 106,
    parentId: 101,
    deptName: '运维部门',
    deptCategory: 'department',
    orderNum: 5,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 107,
    parentId: 101,
    deptName: '人力资源',
    deptCategory: 'department',
    orderNum: 6,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 200,
    parentId: 100,
    deptName: '长沙分公司',
    deptCategory: 'company',
    orderNum: 2,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 201,
    parentId: 200,
    deptName: '研发部门',
    deptCategory: 'department',
    orderNum: 1,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    deptId: 202,
    parentId: 200,
    deptName: '市场部门',
    deptCategory: 'department',
    orderNum: 2,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
]

// 角色数据
const mockRoles: Role[] = [
  {
    roleId: 1,
    roleName: '超级管理员',
    roleKey: 'admin',
    roleSort: 1,
    dataScope: '1',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '超级管理员',
    delFlag: '0',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    menuIds: [],
    deptIds: [],
  },
  {
    roleId: 2,
    roleName: '普通角色',
    roleKey: 'common',
    roleSort: 2,
    dataScope: '2',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '普通角色',
    delFlag: '0',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    menuIds: [1, 2, 3, 100, 101, 102, 103, 104, 105],
    deptIds: [100, 101, 102, 103, 104, 105, 106, 107],
  },
  {
    roleId: 3,
    roleName: '研发角色',
    roleKey: 'developer',
    roleSort: 3,
    dataScope: '3',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '研发角色',
    delFlag: '0',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    menuIds: [1, 2, 100, 101, 102],
    deptIds: [102],
  },
  {
    roleId: 4,
    roleName: '测试角色',
    roleKey: 'tester',
    roleSort: 4,
    dataScope: '4',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '测试角色',
    delFlag: '0',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    menuIds: [1, 2, 100, 104],
    deptIds: [104],
  },
  {
    roleId: 5,
    roleName: '访客角色',
    roleKey: 'visitor',
    roleSort: 5,
    dataScope: '5',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '访客角色',
    delFlag: '0',
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    menuIds: [1, 2],
    deptIds: [],
  },
]

// 岗位数据
const mockPosts: Post[] = [
  {
    postId: 1,
    deptId: 100,
    deptName: '若依科技',
    postCode: 'ceo',
    postCategory: 'management',
    postName: '董事长',
    postSort: 1,
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
  },
  {
    postId: 2,
    deptId: 100,
    deptName: '若依科技',
    postCode: 'pm',
    postCategory: 'management',
    postName: '项目经理',
    postSort: 2,
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
  },
  {
    postId: 3,
    deptId: 102,
    deptName: '研发部门',
    postCode: 'dev',
    postCategory: 'technical',
    postName: '开发人员',
    postSort: 3,
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
  },
  {
    postId: 4,
    deptId: 104,
    deptName: '测试部门',
    postCode: 'test',
    postCategory: 'technical',
    postName: '测试人员',
    postSort: 4,
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
  },
  {
    postId: 5,
    deptId: 103,
    deptName: '市场部门',
    postCode: 'sales',
    postCategory: 'operation',
    postName: '市场专员',
    postSort: 5,
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
  },
  {
    postId: 6,
    deptId: 107,
    deptName: '人力资源',
    postCode: 'hr',
    postCategory: 'support',
    postName: '人事专员',
    postSort: 6,
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
  },
  {
    postId: 7,
    deptId: 106,
    deptName: '运维部门',
    postCode: 'ops',
    postCategory: 'technical',
    postName: '运维人员',
    postSort: 7,
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
  },
]

// 用户数据
const mockUsers: User[] = [
  {
    userId: 1,
    deptId: 102,
    userName: 'admin',
    nickName: '超级管理员',
    email: 'admin@example.com',
    phonenumber: '15888888888',
    sex: '0',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '管理员',
    delFlag: '0',
    avatar: '',
    roles: [1],
    posts: [1],
  },
  {
    userId: 2,
    deptId: 102,
    userName: 'zhangsan',
    nickName: '张三',
    email: 'zhangsan@example.com',
    phonenumber: '15666666666',
    sex: '0',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '测试用户',
    delFlag: '0',
    avatar: '',
    roles: [2, 3],
    posts: [3],
  },
  {
    userId: 3,
    deptId: 103,
    userName: 'lisi',
    nickName: '李四',
    email: 'lisi@example.com',
    phonenumber: '15666666667',
    sex: '1',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '市场专员',
    delFlag: '0',
    avatar: '',
    roles: [2],
    posts: [5],
  },
  {
    userId: 4,
    deptId: 104,
    userName: 'wangwu',
    nickName: '王五',
    email: 'wangwu@example.com',
    phonenumber: '15666666668',
    sex: '0',
    status: '0',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '测试人员',
    delFlag: '0',
    avatar: '',
    roles: [4],
    posts: [4],
  },
  {
    userId: 5,
    deptId: 105,
    userName: 'zhaoliu',
    nickName: '赵六',
    email: 'zhaoliu@example.com',
    phonenumber: '15666666669',
    sex: '0',
    status: '1',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: 'admin',
    updateTime: '2023-06-01 00:00:00',
    remark: '已停用',
    delFlag: '0',
    avatar: '',
    roles: [2],
    posts: [],
  },
  {
    userId: 6,
    deptId: 106,
    userName: 'sunqi',
    nickName: '孙七',
    email: 'sunqi@example.com',
    phonenumber: '15666666670',
    sex: '1',
    status: '0',
    createByName: 'admin',
    createTime: '2023-02-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '运维人员',
    delFlag: '0',
    avatar: '',
    roles: [3],
    posts: [7],
  },
  {
    userId: 7,
    deptId: 107,
    userName: 'zhouba',
    nickName: '周八',
    email: 'zhouba@example.com',
    phonenumber: '15666666671',
    sex: '0',
    status: '0',
    createByName: 'admin',
    createTime: '2023-02-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '人事专员',
    delFlag: '0',
    avatar: '',
    roles: [2],
    posts: [6],
  },
  {
    userId: 8,
    deptId: 102,
    userName: 'wujiu',
    nickName: '吴九',
    email: 'wujiu@example.com',
    phonenumber: '15666666672',
    sex: '0',
    status: '0',
    createByName: 'admin',
    createTime: '2023-03-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '开发人员',
    delFlag: '0',
    avatar: '',
    roles: [3],
    posts: [3],
  },
  {
    userId: 9,
    deptId: 201,
    userName: 'zhengshi',
    nickName: '郑十',
    email: 'zhengshi@example.com',
    phonenumber: '15666666673',
    sex: '1',
    status: '0',
    createByName: 'admin',
    createTime: '2023-03-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '长沙研发',
    delFlag: '0',
    avatar: '',
    roles: [3],
    posts: [3],
  },
  {
    userId: 10,
    deptId: 202,
    userName: 'visitor',
    nickName: '访客用户',
    email: 'visitor@example.com',
    phonenumber: '15666666674',
    sex: '2',
    status: '0',
    createByName: 'admin',
    createTime: '2023-04-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '访客',
    delFlag: '0',
    avatar: '',
    roles: [5],
    posts: [],
  },
]

// 菜单数据
const mockMenus: Menu[] = [
  {
    menuId: 1,
    menuName: '系统管理',
    parentId: 0,
    orderNum: 1,
    path: 'system',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'system',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '系统管理目录',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 2,
    menuName: '系统监控',
    parentId: 0,
    orderNum: 2,
    path: 'monitor',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'monitor',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '系统监控目录',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 100,
    menuName: '用户管理',
    parentId: 1,
    orderNum: 1,
    path: 'user',
    component: 'system/user/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:user:list',
    icon: 'user',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '用户管理菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 101,
    menuName: '角色管理',
    parentId: 1,
    orderNum: 2,
    path: 'role',
    component: 'system/role/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:role:list',
    icon: 'peoples',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '角色管理菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 102,
    menuName: '菜单管理',
    parentId: 1,
    orderNum: 3,
    path: 'menu',
    component: 'system/menu/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:menu:list',
    icon: 'tree-table',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '菜单管理菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 103,
    menuName: '部门管理',
    parentId: 1,
    orderNum: 4,
    path: 'dept',
    component: 'system/dept/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:dept:list',
    icon: 'tree',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '部门管理菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 104,
    menuName: '岗位管理',
    parentId: 1,
    orderNum: 5,
    path: 'post',
    component: 'system/post/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:post:list',
    icon: 'post',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '岗位管理菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 105,
    menuName: '字典管理',
    parentId: 1,
    orderNum: 6,
    path: 'dict',
    component: 'system/dict/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:dict:list',
    icon: 'dict',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '字典管理菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 106,
    menuName: '参数设置',
    parentId: 1,
    orderNum: 7,
    path: 'config',
    component: 'system/config/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:config:list',
    icon: 'edit',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '参数设置菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 107,
    menuName: '通知公告',
    parentId: 1,
    orderNum: 8,
    path: 'notice',
    component: 'system/notice/index',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'C',
    visible: '0',
    status: '0',
    perms: 'system:notice:list',
    icon: 'message',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '通知公告菜单',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 1000,
    menuName: '用户查询',
    parentId: 100,
    orderNum: 1,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'F',
    visible: '0',
    status: '0',
    perms: 'system:user:query',
    icon: '',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 1001,
    menuName: '用户新增',
    parentId: 100,
    orderNum: 2,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'F',
    visible: '0',
    status: '0',
    perms: 'system:user:add',
    icon: '',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 1002,
    menuName: '用户修改',
    parentId: 100,
    orderNum: 3,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'F',
    visible: '0',
    status: '0',
    perms: 'system:user:edit',
    icon: '',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 1003,
    menuName: '用户删除',
    parentId: 100,
    orderNum: 4,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'F',
    visible: '0',
    status: '0',
    perms: 'system:user:remove',
    icon: '',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 1004,
    menuName: '用户导出',
    parentId: 100,
    orderNum: 5,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'F',
    visible: '0',
    status: '0',
    perms: 'system:user:export',
    icon: '',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 1005,
    menuName: '用户导入',
    parentId: 100,
    orderNum: 6,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'F',
    visible: '0',
    status: '0',
    perms: 'system:user:import',
    icon: '',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
  {
    menuId: 1006,
    menuName: '重置密码',
    parentId: 100,
    orderNum: 7,
    path: '',
    component: '',
    queryParam: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'F',
    visible: '0',
    status: '0',
    perms: 'system:user:resetPwd',
    icon: '',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    updateByName: '',
    updateTime: '',
    remark: '',
    delFlag: '0',
    children: [],
  },
]

// 字典类型数据
const mockDictTypes: DictType[] = [
  {
    dictId: 1,
    dictName: '用户性别',
    dictType: 'sys_user_sex',
    remark: '用户性别列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 2,
    dictName: '菜单状态',
    dictType: 'sys_show_hide',
    remark: '菜单状态列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 3,
    dictName: '系统开关',
    dictType: 'sys_normal_disable',
    remark: '系统开关列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 4,
    dictName: '任务状态',
    dictType: 'sys_job_status',
    remark: '任务状态列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 5,
    dictName: '任务分组',
    dictType: 'sys_job_group',
    remark: '任务分组列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 6,
    dictName: '通知类型',
    dictType: 'sys_notice_type',
    remark: '通知类型列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 7,
    dictName: '通知状态',
    dictType: 'sys_notice_status',
    remark: '通知状态列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 8,
    dictName: '系统是否',
    dictType: 'sys_yes_no',
    remark: '系统是否列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 9,
    dictName: '菜单类型',
    dictType: 'sys_menu_type',
    remark: '菜单类型列表',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictId: 10,
    dictName: '数据范围',
    dictType: 'sys_data_scope',
    remark: '数据范围列表',
    createTime: '2023-01-01 00:00:00',
  },
]

// 字典数据
const mockDictDatas: DictData[] = [
  // sys_user_sex
  {
    dictCode: 1,
    dictType: 'sys_user_sex',
    dictLabel: '男',
    dictValue: '0',
    cssClass: '',
    listClass: 'primary',
    dictSort: 1,
    remark: '性别男',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 2,
    dictType: 'sys_user_sex',
    dictLabel: '女',
    dictValue: '1',
    cssClass: '',
    listClass: 'danger',
    dictSort: 2,
    remark: '性别女',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 3,
    dictType: 'sys_user_sex',
    dictLabel: '未知',
    dictValue: '2',
    cssClass: '',
    listClass: 'info',
    dictSort: 3,
    remark: '性别未知',
    createTime: '2023-01-01 00:00:00',
  },
  // sys_normal_disable
  {
    dictCode: 4,
    dictType: 'sys_normal_disable',
    dictLabel: '正常',
    dictValue: '0',
    cssClass: '',
    listClass: 'primary',
    dictSort: 1,
    remark: '正常状态',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 5,
    dictType: 'sys_normal_disable',
    dictLabel: '停用',
    dictValue: '1',
    cssClass: '',
    listClass: 'danger',
    dictSort: 2,
    remark: '停用状态',
    createTime: '2023-01-01 00:00:00',
  },
  // sys_show_hide
  {
    dictCode: 6,
    dictType: 'sys_show_hide',
    dictLabel: '显示',
    dictValue: '0',
    cssClass: '',
    listClass: 'primary',
    dictSort: 1,
    remark: '显示菜单',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 7,
    dictType: 'sys_show_hide',
    dictLabel: '隐藏',
    dictValue: '1',
    cssClass: '',
    listClass: 'danger',
    dictSort: 2,
    remark: '隐藏菜单',
    createTime: '2023-01-01 00:00:00',
  },
  // sys_notice_type
  {
    dictCode: 8,
    dictType: 'sys_notice_type',
    dictLabel: '通知',
    dictValue: '1',
    cssClass: '',
    listClass: 'warning',
    dictSort: 1,
    remark: '通知',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 9,
    dictType: 'sys_notice_type',
    dictLabel: '公告',
    dictValue: '2',
    cssClass: '',
    listClass: 'success',
    dictSort: 2,
    remark: '公告',
    createTime: '2023-01-01 00:00:00',
  },
  // sys_notice_status
  {
    dictCode: 10,
    dictType: 'sys_notice_status',
    dictLabel: '正常',
    dictValue: '0',
    cssClass: '',
    listClass: 'primary',
    dictSort: 1,
    remark: '正常状态',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 11,
    dictType: 'sys_notice_status',
    dictLabel: '关闭',
    dictValue: '1',
    cssClass: '',
    listClass: 'danger',
    dictSort: 2,
    remark: '关闭状态',
    createTime: '2023-01-01 00:00:00',
  },
  // sys_yes_no
  {
    dictCode: 12,
    dictType: 'sys_yes_no',
    dictLabel: '是',
    dictValue: 'Y',
    cssClass: '',
    listClass: 'primary',
    dictSort: 1,
    remark: '是',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 13,
    dictType: 'sys_yes_no',
    dictLabel: '否',
    dictValue: 'N',
    cssClass: '',
    listClass: 'danger',
    dictSort: 2,
    remark: '否',
    createTime: '2023-01-01 00:00:00',
  },
  // sys_menu_type
  {
    dictCode: 14,
    dictType: 'sys_menu_type',
    dictLabel: '目录',
    dictValue: 'M',
    cssClass: '',
    listClass: 'primary',
    dictSort: 1,
    remark: '目录',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 15,
    dictType: 'sys_menu_type',
    dictLabel: '菜单',
    dictValue: 'C',
    cssClass: '',
    listClass: 'success',
    dictSort: 2,
    remark: '菜单',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 16,
    dictType: 'sys_menu_type',
    dictLabel: '按钮',
    dictValue: 'F',
    cssClass: '',
    listClass: 'warning',
    dictSort: 3,
    remark: '按钮',
    createTime: '2023-01-01 00:00:00',
  },
  // sys_data_scope
  {
    dictCode: 17,
    dictType: 'sys_data_scope',
    dictLabel: '全部数据权限',
    dictValue: '1',
    cssClass: '',
    listClass: 'primary',
    dictSort: 1,
    remark: '全部数据权限',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 18,
    dictType: 'sys_data_scope',
    dictLabel: '自定义数据权限',
    dictValue: '2',
    cssClass: '',
    listClass: 'success',
    dictSort: 2,
    remark: '自定义数据权限',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 19,
    dictType: 'sys_data_scope',
    dictLabel: '本部门数据权限',
    dictValue: '3',
    cssClass: '',
    listClass: 'info',
    dictSort: 3,
    remark: '本部门数据权限',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 20,
    dictType: 'sys_data_scope',
    dictLabel: '本部门及以下数据权限',
    dictValue: '4',
    cssClass: '',
    listClass: 'warning',
    dictSort: 4,
    remark: '本部门及以下数据权限',
    createTime: '2023-01-01 00:00:00',
  },
  {
    dictCode: 21,
    dictType: 'sys_data_scope',
    dictLabel: '仅本人数据权限',
    dictValue: '5',
    cssClass: '',
    listClass: 'danger',
    dictSort: 5,
    remark: '仅本人数据权限',
    createTime: '2023-01-01 00:00:00',
  },
]

// 系统配置数据
const mockConfigs: Config[] = [
  {
    configId: 1,
    configName: '主框架页-默认皮肤样式名称',
    configKey: 'sys.index.skinName',
    configValue: 'skin-blue',
    configType: 'Y',
    remark:
      '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow',
    createTime: '2023-01-01 00:00:00',
  },
  {
    configId: 2,
    configName: '用户管理-账号初始密码',
    configKey: 'sys.user.initPassword',
    configValue: '123456',
    configType: 'Y',
    remark: '初始化密码 123456',
    createTime: '2023-01-01 00:00:00',
  },
  {
    configId: 3,
    configName: '主框架页-侧边栏主题',
    configKey: 'sys.index.sideTheme',
    configValue: 'theme-dark',
    configType: 'Y',
    remark: '深色主题 theme-dark，浅色主题 theme-light',
    createTime: '2023-01-01 00:00:00',
  },
  {
    configId: 4,
    configName: '账号自助-验证码开关',
    configKey: 'sys.account.captchaEnabled',
    configValue: 'true',
    configType: 'Y',
    remark: '是否开启验证码功能（true开启，false关闭）',
    createTime: '2023-01-01 00:00:00',
  },
  {
    configId: 5,
    configName: '账号自助-是否开启用户注册功能',
    configKey: 'sys.account.registerUser',
    configValue: 'false',
    configType: 'Y',
    remark: '是否开启注册用户功能（true开启，false关闭）',
    createTime: '2023-01-01 00:00:00',
  },
  {
    configId: 6,
    configName: '文件上传-文件路径',
    configKey: 'sys.upload.path',
    configValue: '/upload',
    configType: 'N',
    remark: '文件上传路径',
    createTime: '2023-01-01 00:00:00',
  },
  {
    configId: 7,
    configName: '文件上传-最大大小',
    configKey: 'sys.upload.maxSize',
    configValue: '10',
    configType: 'N',
    remark: '文件上传最大大小（MB）',
    createTime: '2023-01-01 00:00:00',
  },
  {
    configId: 8,
    configName: '系统名称',
    configKey: 'sys.system.name',
    configValue: 'RuoYi-Vue-Plus',
    configType: 'Y',
    remark: '系统名称',
    createTime: '2023-01-01 00:00:00',
  },
]

// 通知公告数据
const mockNotices: Notice[] = [
  {
    noticeId: 1,
    noticeTitle: '系统上线通知',
    noticeType: '1',
    noticeContent:
      '<p>尊敬的用户：</p><p>系统将于2023年6月1日正式上线，届时请各位用户使用新系统进行操作。</p><p>如有问题请联系管理员。</p>',
    status: '0',
    createByName: 'admin',
    createTime: '2023-05-15 10:00:00',
    remark: '系统上线通知',
  },
  {
    noticeId: 2,
    noticeTitle: '系统维护公告',
    noticeType: '2',
    noticeContent:
      '<p>系统将于2023年6月15日凌晨2:00-6:00进行维护升级，届时系统将无法访问。</p><p>请各位用户提前做好相关工作安排。</p>',
    status: '0',
    createByName: 'admin',
    createTime: '2023-06-10 09:00:00',
    remark: '维护公告',
  },
  {
    noticeId: 3,
    noticeTitle: '版本更新通知',
    noticeType: '1',
    noticeContent:
      '<p>系统已更新至 V2.0 版本，主要更新内容：</p><ul><li>新增用户管理功能</li><li>优化角色权限配置</li><li>修复已知问题</li></ul>',
    status: '0',
    createByName: 'admin',
    createTime: '2023-07-01 14:00:00',
    remark: '版本更新通知',
  },
  {
    noticeId: 4,
    noticeTitle: '国庆节放假通知',
    noticeType: '2',
    noticeContent:
      '<p>根据国家法定节假日安排，国庆节放假时间为10月1日至10月7日。</p><p>放假期间如有紧急情况请联系值班人员。</p>',
    status: '0',
    createByName: 'admin',
    createTime: '2023-09-25 16:00:00',
    remark: '放假通知',
  },
  {
    noticeId: 5,
    noticeTitle: '安全提醒',
    noticeType: '1',
    noticeContent:
      '<p>近期发现有不法分子冒充客服进行诈骗，请各位用户注意：</p><ul><li>不要向任何人透露密码</li><li>不要点击来历不明的链接</li><li>如有疑问请联系官方客服</li></ul>',
    status: '0',
    createByName: 'admin',
    createTime: '2023-08-10 11:00:00',
    remark: '安全提醒',
  },
  {
    noticeId: 6,
    noticeTitle: '已关闭的测试公告',
    noticeType: '2',
    noticeContent: '<p>这是一条已关闭的测试公告。</p>',
    status: '1',
    createByName: 'admin',
    createTime: '2023-01-01 00:00:00',
    remark: '已关闭',
  },
]

// ==================== 辅助函数 ====================

function buildDeptTree(depts: Dept[], parentId: number = 0): Dept[] {
  return depts
    .filter((dept) => dept.parentId === parentId)
    .map((dept) => ({
      ...dept,
      children: buildDeptTree(depts, dept.deptId),
    }))
}

function buildMenuTree(menus: Menu[], parentId: number = 0): Menu[] {
  return menus
    .filter((menu) => menu.parentId === parentId)
    .map((menu) => ({
      ...menu,
      children: buildMenuTree(menus, menu.menuId),
    }))
}

function buildTreeSelect(
  items: Array<{ id: number; name: string; parentId: number }>,
  parentId: number = 0
): TreeSelect[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      id: item.id,
      label: item.name,
      children: buildTreeSelect(items, item.id),
    }))
}

// ==================== 用户相关 API ====================

/** 获取用户列表 */
export async function userList(
  query: UserQuery
): Promise<ApiResult<PageResult<User>>> {
  await sleep(300)
  let filteredUsers = [...mockUsers]

  if (query.userName) {
    filteredUsers = filteredUsers.filter((u) =>
      u.userName.includes(query.userName!)
    )
  }
  if (query.phonenumber) {
    filteredUsers = filteredUsers.filter((u) =>
      u.phonenumber.includes(query.phonenumber!)
    )
  }
  if (query.status) {
    filteredUsers = filteredUsers.filter((u) => u.status === query.status)
  }
  if (query.deptId) {
    filteredUsers = filteredUsers.filter((u) => u.deptId === query.deptId)
  }

  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  // 为用户添加部门信息
  const usersWithDept = filteredUsers.map((user) => ({
    ...user,
    dept: mockDepts.find((d) => d.deptId === user.deptId),
  }))

  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: usersWithDept.slice(start, end),
      total: filteredUsers.length,
    },
  }
}

/** 获取用户详情 */
export async function getUser(userId: number): Promise<ApiResult<User>> {
  await sleep(200)
  const user = mockUsers.find((u) => u.userId === userId)
  if (!user) {
    return { code: 404, msg: '用户不存在', data: null as unknown as User }
  }
  return {
    code: 200,
    msg: '查询成功',
    data: {
      ...user,
      dept: mockDepts.find((d) => d.deptId === user.deptId),
    },
  }
}

/** 新增用户 */
export async function addUser(data: UserForm): Promise<ApiResult<void>> {
  await sleep(300)
  const newUser: User = {
    userId: Math.max(...mockUsers.map((u) => u.userId)) + 1,
    deptId: data.deptId,
    userName: data.userName,
    nickName: data.nickName,
    email: data.email,
    phonenumber: data.phonenumber,
    sex: data.sex,
    status: data.status,
    createByName: 'admin',
    createTime: new Date().toLocaleString(),
    updateByName: '',
    updateTime: '',
    remark: data.remark,
    delFlag: '0',
    avatar: '',
    roles: data.roleIds,
    posts: data.postIds,
  }
  mockUsers.push(newUser)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改用户 */
export async function updateUser(data: UserForm): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockUsers.findIndex((u) => u.userId === data.userId)
  if (index === -1) {
    return { code: 404, msg: '用户不存在', data: undefined }
  }
  mockUsers[index] = {
    ...mockUsers[index],
    deptId: data.deptId,
    userName: data.userName,
    nickName: data.nickName,
    email: data.email,
    phonenumber: data.phonenumber,
    sex: data.sex,
    status: data.status,
    updateByName: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark,
    roles: data.roleIds,
    posts: data.postIds,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除用户 */
export async function deleteUser(userId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockUsers.findIndex((u) => u.userId === userId)
  if (index === -1) {
    return { code: 404, msg: '用户不存在', data: undefined }
  }
  mockUsers.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 重置用户密码 */
export async function resetUserPwd(userId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const user = mockUsers.find((u) => u.userId === userId)
  if (!user) {
    return { code: 404, msg: '用户不存在', data: undefined }
  }
  return { code: 200, msg: '密码已重置为123456', data: undefined }
}

/** 修改用户状态 */
export async function changeUserStatus(
  userId: number,
  status: string
): Promise<ApiResult<void>> {
  await sleep(300)
  const user = mockUsers.find((u) => u.userId === userId)
  if (!user) {
    return { code: 404, msg: '用户不存在', data: undefined }
  }
  user.status = status
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 获取部门树 */
export async function deptTree(): Promise<ApiResult<Dept[]>> {
  await sleep(200)
  return {
    code: 200,
    msg: '查询成功',
    data: buildDeptTree(mockDepts),
  }
}

/** 获取角色选项列表 */
export async function roleOptions(): Promise<ApiResult<RoleOption[]>> {
  await sleep(200)
  return {
    code: 200,
    msg: '查询成功',
    data: mockRoles.map((r) => ({ roleId: r.roleId, roleName: r.roleName })),
  }
}

/** 获取岗位选项列表 */
export async function postOptions(): Promise<ApiResult<PostOption[]>> {
  await sleep(200)
  return {
    code: 200,
    msg: '查询成功',
    data: mockPosts.map((p) => ({
      postId: p.postId,
      postName: p.postName,
      postCode: p.postCode,
    })),
  }
}

// ==================== 角色相关 API ====================

/** 获取角色列表 */
export async function roleList(
  query: RoleQuery
): Promise<ApiResult<PageResult<Role>>> {
  await sleep(300)
  let filteredRoles = [...mockRoles]

  if (query.roleName) {
    filteredRoles = filteredRoles.filter((r) =>
      r.roleName.includes(query.roleName!)
    )
  }
  if (query.roleKey) {
    filteredRoles = filteredRoles.filter((r) =>
      r.roleKey.includes(query.roleKey!)
    )
  }
  if (query.status) {
    filteredRoles = filteredRoles.filter((r) => r.status === query.status)
  }

  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: filteredRoles.slice(start, end),
      total: filteredRoles.length,
    },
  }
}

/** 获取角色详情 */
export async function getRole(roleId: number): Promise<ApiResult<Role>> {
  await sleep(200)
  const role = mockRoles.find((r) => r.roleId === roleId)
  if (!role) {
    return { code: 404, msg: '角色不存在', data: null as unknown as Role }
  }
  return { code: 200, msg: '查询成功', data: role }
}

/** 新增角色 */
export async function addRole(data: RoleForm): Promise<ApiResult<void>> {
  await sleep(300)
  const newRole: Role = {
    roleId: Math.max(...mockRoles.map((r) => r.roleId)) + 1,
    roleName: data.roleName,
    roleKey: data.roleKey,
    roleSort: data.roleSort,
    dataScope: data.dataScope,
    status: data.status,
    createByName: 'admin',
    createTime: new Date().toLocaleString(),
    updateByName: '',
    updateTime: '',
    remark: data.remark,
    delFlag: '0',
    menuCheckStrictly: data.menuCheckStrictly,
    deptCheckStrictly: data.deptCheckStrictly,
    menuIds: data.menuIds,
    deptIds: data.deptIds,
  }
  mockRoles.push(newRole)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改角色 */
export async function updateRole(data: RoleForm): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockRoles.findIndex((r) => r.roleId === data.roleId)
  if (index === -1) {
    return { code: 404, msg: '角色不存在', data: undefined }
  }
  mockRoles[index] = {
    ...mockRoles[index],
    roleName: data.roleName,
    roleKey: data.roleKey,
    roleSort: data.roleSort,
    dataScope: data.dataScope,
    status: data.status,
    updateByName: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark,
    menuCheckStrictly: data.menuCheckStrictly,
    deptCheckStrictly: data.deptCheckStrictly,
    menuIds: data.menuIds,
    deptIds: data.deptIds,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除角色 */
export async function deleteRole(roleId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockRoles.findIndex((r) => r.roleId === roleId)
  if (index === -1) {
    return { code: 404, msg: '角色不存在', data: undefined }
  }
  mockRoles.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 修改角色状态 */
export async function changeRoleStatus(
  roleId: number,
  status: string
): Promise<ApiResult<void>> {
  await sleep(300)
  const role = mockRoles.find((r) => r.roleId === roleId)
  if (!role) {
    return { code: 404, msg: '角色不存在', data: undefined }
  }
  role.status = status
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 获取角色菜单树 */
export async function roleMenuTreeselect(
  _roleId: number
): Promise<ApiResult<MenuTreeSelect[]>> {
  await sleep(200)
  // const role = mockRoles.find((r) => r.roleId === roleId)
  const menuItems = mockMenus.map((m) => ({
    id: m.menuId,
    name: m.menuName,
    parentId: m.parentId,
  }))
  return {
    code: 200,
    msg: '查询成功',
    data: buildTreeSelect(menuItems) as MenuTreeSelect[],
  }
}

/** 获取角色部门树 */
export async function roleDeptTreeselect(
  _roleId: number
): Promise<ApiResult<TreeSelect[]>> {
  await sleep(200)
  const deptItems = mockDepts.map((d) => ({
    id: d.deptId,
    name: d.deptName,
    parentId: d.parentId,
  }))
  return {
    code: 200,
    msg: '查询成功',
    data: buildTreeSelect(deptItems),
  }
}

// ==================== 菜单相关 API ====================

/** 获取菜单列表 */
export async function menuList(query: MenuQuery): Promise<ApiResult<Menu[]>> {
  await sleep(300)
  let filteredMenus = [...mockMenus]

  if (query.menuName) {
    filteredMenus = filteredMenus.filter((m) =>
      m.menuName.includes(query.menuName!)
    )
  }
  if (query.status) {
    filteredMenus = filteredMenus.filter((m) => m.status === query.status)
  }

  return {
    code: 200,
    msg: '查询成功',
    data: buildMenuTree(filteredMenus),
  }
}

/** 获取菜单详情 */
export async function getMenu(menuId: number): Promise<ApiResult<Menu>> {
  await sleep(200)
  const menu = mockMenus.find((m) => m.menuId === menuId)
  if (!menu) {
    return { code: 404, msg: '菜单不存在', data: null as unknown as Menu }
  }
  return { code: 200, msg: '查询成功', data: menu }
}

/** 新增菜单 */
export async function addMenu(data: MenuForm): Promise<ApiResult<void>> {
  await sleep(300)
  const newMenu: Menu = {
    menuId: Math.max(...mockMenus.map((m) => m.menuId)) + 1,
    menuName: data.menuName,
    parentId: data.parentId,
    orderNum: data.orderNum,
    path: data.path,
    component: data.component,
    queryParam: data.queryParam,
    isFrame: data.isFrame,
    isCache: data.isCache,
    menuType: data.menuType,
    visible: data.visible,
    status: data.status,
    perms: data.perms,
    icon: data.icon,
    createByName: 'admin',
    createTime: new Date().toLocaleString(),
    updateByName: '',
    updateTime: '',
    remark: data.remark,
    delFlag: '0',
    children: [],
  }
  mockMenus.push(newMenu)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改菜单 */
export async function updateMenu(data: MenuForm): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockMenus.findIndex((m) => m.menuId === data.menuId)
  if (index === -1) {
    return { code: 404, msg: '菜单不存在', data: undefined }
  }
  mockMenus[index] = {
    ...mockMenus[index],
    menuName: data.menuName,
    parentId: data.parentId,
    orderNum: data.orderNum,
    path: data.path,
    component: data.component,
    queryParam: data.queryParam,
    isFrame: data.isFrame,
    isCache: data.isCache,
    menuType: data.menuType,
    visible: data.visible,
    status: data.status,
    perms: data.perms,
    icon: data.icon,
    updateByName: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除菜单 */
export async function deleteMenu(menuId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockMenus.findIndex((m) => m.menuId === menuId)
  if (index === -1) {
    return { code: 404, msg: '菜单不存在', data: undefined }
  }
  mockMenus.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 获取菜单树选择 */
export async function menuTreeselect(): Promise<ApiResult<MenuTreeSelect[]>> {
  await sleep(200)
  const menuItems = mockMenus.map((m) => ({
    id: m.menuId,
    name: m.menuName,
    parentId: m.parentId,
  }))
  return {
    code: 200,
    msg: '查询成功',
    data: buildTreeSelect(menuItems) as MenuTreeSelect[],
  }
}

// ==================== 部门相关 API ====================

/** 获取部门列表 */
export async function deptList(query: DeptQuery): Promise<ApiResult<Dept[]>> {
  await sleep(300)
  let filteredDepts = [...mockDepts]

  if (query.deptName) {
    filteredDepts = filteredDepts.filter((d) =>
      d.deptName.includes(query.deptName!)
    )
  }
  if (query.status) {
    filteredDepts = filteredDepts.filter((d) => d.status === query.status)
  }

  return {
    code: 200,
    msg: '查询成功',
    data: buildDeptTree(filteredDepts),
  }
}

/** 获取部门详情 */
export async function getDept(deptId: number): Promise<ApiResult<Dept>> {
  await sleep(200)
  const dept = mockDepts.find((d) => d.deptId === deptId)
  if (!dept) {
    return { code: 404, msg: '部门不存在', data: null as unknown as Dept }
  }
  const parentDept = mockDepts.find((d) => d.deptId === dept.parentId)
  return {
    code: 200,
    msg: '查询成功',
    data: { ...dept, parentName: parentDept?.deptName || '' },
  }
}

/** 新增部门 */
export async function addDept(data: DeptForm): Promise<ApiResult<void>> {
  await sleep(300)
  const newDept: Dept = {
    deptId: Math.max(...mockDepts.map((d) => d.deptId)) + 1,
    parentId: data.parentId,
    deptName: data.deptName,
    deptCategory: data.deptCategory,
    orderNum: data.orderNum,
    leader: data.leader,
    phone: data.phone,
    email: data.email,
    status: data.status,
    createByName: 'admin',
    createTime: new Date().toLocaleString(),
    updateByName: '',
    updateTime: '',
    remark: data.remark,
    delFlag: '0',
    children: [],
  }
  mockDepts.push(newDept)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改部门 */
export async function updateDept(data: DeptForm): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockDepts.findIndex((d) => d.deptId === data.deptId)
  if (index === -1) {
    return { code: 404, msg: '部门不存在', data: undefined }
  }
  mockDepts[index] = {
    ...mockDepts[index],
    parentId: data.parentId,
    deptName: data.deptName,
    deptCategory: data.deptCategory,
    orderNum: data.orderNum,
    leader: data.leader,
    phone: data.phone,
    email: data.email,
    status: data.status,
    updateByName: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除部门 */
export async function deleteDept(deptId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const hasChildren = mockDepts.some((d) => d.parentId === deptId)
  if (hasChildren) {
    return { code: 400, msg: '存在子部门,不允许删除', data: undefined }
  }
  const index = mockDepts.findIndex((d) => d.deptId === deptId)
  if (index === -1) {
    return { code: 404, msg: '部门不存在', data: undefined }
  }
  mockDepts.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 获取部门树选择 */
export async function deptTreeselect(): Promise<ApiResult<TreeSelect[]>> {
  await sleep(200)
  const deptItems = mockDepts.map((d) => ({
    id: d.deptId,
    name: d.deptName,
    parentId: d.parentId,
  }))
  return {
    code: 200,
    msg: '查询成功',
    data: buildTreeSelect(deptItems),
  }
}

// ==================== 岗位相关 API ====================

/** 获取岗位列表 */
export async function postList(
  query: PostQuery
): Promise<ApiResult<PageResult<Post>>> {
  await sleep(300)
  let filteredPosts = [...mockPosts]

  if (query.postCode) {
    filteredPosts = filteredPosts.filter((p) =>
      p.postCode.includes(query.postCode!)
    )
  }
  if (query.postName) {
    filteredPosts = filteredPosts.filter((p) =>
      p.postName.includes(query.postName!)
    )
  }
  if (query.postCategory) {
    filteredPosts = filteredPosts.filter((p) =>
      p.postCategory.includes(query.postCategory!)
    )
  }
  if (query.status) {
    filteredPosts = filteredPosts.filter((p) => p.status === query.status)
  }
  if (query.deptId) {
    filteredPosts = filteredPosts.filter((p) => p.deptId === query.deptId)
  }

  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: filteredPosts.slice(start, end),
      total: filteredPosts.length,
    },
  }
}

/** 获取岗位详情 */
export async function getPost(postId: number): Promise<ApiResult<Post>> {
  await sleep(200)
  const post = mockPosts.find((p) => p.postId === postId)
  if (!post) {
    return { code: 404, msg: '岗位不存在', data: null as unknown as Post }
  }
  return { code: 200, msg: '查询成功', data: post }
}

/** 新增岗位 */
export async function addPost(data: PostForm): Promise<ApiResult<void>> {
  await sleep(300)
  const dept = mockDepts.find((d) => d.deptId === data.deptId)
  const newPost: Post = {
    postId: Math.max(...mockPosts.map((p) => p.postId)) + 1,
    deptId: data.deptId,
    deptName: dept?.deptName || '',
    postCode: data.postCode,
    postCategory: data.postCategory,
    postName: data.postName,
    postSort: data.postSort,
    status: data.status,
    createByName: 'admin',
    createTime: new Date().toLocaleString(),
    updateByName: '',
    updateTime: '',
    remark: data.remark,
    delFlag: '0',
  }
  mockPosts.push(newPost)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改岗位 */
export async function updatePost(data: PostForm): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockPosts.findIndex((p) => p.postId === data.postId)
  if (index === -1) {
    return { code: 404, msg: '岗位不存在', data: undefined }
  }
  const dept = mockDepts.find((d) => d.deptId === data.deptId)
  mockPosts[index] = {
    ...mockPosts[index],
    deptId: data.deptId,
    deptName: dept?.deptName || '',
    postCode: data.postCode,
    postCategory: data.postCategory,
    postName: data.postName,
    postSort: data.postSort,
    status: data.status,
    updateByName: 'admin',
    updateTime: new Date().toLocaleString(),
    remark: data.remark,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除岗位 */
export async function deletePost(postId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockPosts.findIndex((p) => p.postId === postId)
  if (index === -1) {
    return { code: 404, msg: '岗位不存在', data: undefined }
  }
  mockPosts.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 根据部门ID获取岗位选项 */
export async function postOptionsByDeptId(
  deptId: number
): Promise<ApiResult<PostOption[]>> {
  await sleep(200)
  const posts = mockPosts.filter((p) => p.deptId === deptId && p.status === '0')
  return {
    code: 200,
    msg: '查询成功',
    data: posts.map((p) => ({
      postId: p.postId,
      postName: p.postName,
      postCode: p.postCode,
    })),
  }
}

// ==================== 字典类型相关 API ====================

/** 获取字典类型列表 */
export async function dictTypeList(
  query: DictTypeQuery
): Promise<ApiResult<PageResult<DictType>>> {
  await sleep(300)
  let filteredTypes = [...mockDictTypes]

  if (query.dictName) {
    filteredTypes = filteredTypes.filter((d) =>
      d.dictName.includes(query.dictName!)
    )
  }
  if (query.dictType) {
    filteredTypes = filteredTypes.filter((d) =>
      d.dictType.includes(query.dictType!)
    )
  }

  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: filteredTypes.slice(start, end),
      total: filteredTypes.length,
    },
  }
}

/** 获取字典类型详情 */
export async function getDictType(
  dictId: number
): Promise<ApiResult<DictType>> {
  await sleep(200)
  const dictType = mockDictTypes.find((d) => d.dictId === dictId)
  if (!dictType) {
    return {
      code: 404,
      msg: '字典类型不存在',
      data: null as unknown as DictType,
    }
  }
  return { code: 200, msg: '查询成功', data: dictType }
}

/** 新增字典类型 */
export async function addDictType(
  data: DictTypeForm
): Promise<ApiResult<void>> {
  await sleep(300)
  const newDictType: DictType = {
    dictId: Math.max(...mockDictTypes.map((d) => d.dictId)) + 1,
    dictName: data.dictName,
    dictType: data.dictType,
    remark: data.remark,
    createTime: new Date().toLocaleString(),
  }
  mockDictTypes.push(newDictType)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改字典类型 */
export async function updateDictType(
  data: DictTypeForm
): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockDictTypes.findIndex((d) => d.dictId === data.dictId)
  if (index === -1) {
    return { code: 404, msg: '字典类型不存在', data: undefined }
  }
  mockDictTypes[index] = {
    ...mockDictTypes[index],
    dictName: data.dictName,
    dictType: data.dictType,
    remark: data.remark,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除字典类型 */
export async function deleteDictType(dictId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockDictTypes.findIndex((d) => d.dictId === dictId)
  if (index === -1) {
    return { code: 404, msg: '字典类型不存在', data: undefined }
  }
  mockDictTypes.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 刷新字典缓存 */
export async function refreshCache(): Promise<ApiResult<void>> {
  await sleep(200)
  return { code: 200, msg: '刷新成功', data: undefined }
}

// ==================== 字典数据相关 API ====================

/** 获取字典数据列表 */
export async function dictDataList(
  query: DictDataQuery
): Promise<ApiResult<PageResult<DictData>>> {
  await sleep(300)
  let filteredDatas = [...mockDictDatas]

  if (query.dictType) {
    filteredDatas = filteredDatas.filter((d) =>
      d.dictType.includes(query.dictType!)
    )
  }
  if (query.dictLabel) {
    filteredDatas = filteredDatas.filter((d) =>
      d.dictLabel.includes(query.dictLabel!)
    )
  }

  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: filteredDatas.slice(start, end),
      total: filteredDatas.length,
    },
  }
}

/** 获取字典数据详情 */
export async function getDictData(
  dictCode: number
): Promise<ApiResult<DictData>> {
  await sleep(200)
  const dictData = mockDictDatas.find((d) => d.dictCode === dictCode)
  if (!dictData) {
    return {
      code: 404,
      msg: '字典数据不存在',
      data: null as unknown as DictData,
    }
  }
  return { code: 200, msg: '查询成功', data: dictData }
}

/** 新增字典数据 */
export async function addDictData(
  data: DictDataForm
): Promise<ApiResult<void>> {
  await sleep(300)
  const newDictData: DictData = {
    dictCode: Math.max(...mockDictDatas.map((d) => d.dictCode)) + 1,
    dictType: data.dictType,
    dictLabel: data.dictLabel,
    dictValue: data.dictValue,
    cssClass: data.cssClass,
    listClass: data.listClass,
    dictSort: data.dictSort,
    remark: data.remark,
    createTime: new Date().toLocaleString(),
  }
  mockDictDatas.push(newDictData)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改字典数据 */
export async function updateDictData(
  data: DictDataForm
): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockDictDatas.findIndex((d) => d.dictCode === data.dictCode)
  if (index === -1) {
    return { code: 404, msg: '字典数据不存在', data: undefined }
  }
  mockDictDatas[index] = {
    ...mockDictDatas[index],
    dictType: data.dictType,
    dictLabel: data.dictLabel,
    dictValue: data.dictValue,
    cssClass: data.cssClass,
    listClass: data.listClass,
    dictSort: data.dictSort,
    remark: data.remark,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除字典数据 */
export async function deleteDictData(
  dictCode: number
): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockDictDatas.findIndex((d) => d.dictCode === dictCode)
  if (index === -1) {
    return { code: 404, msg: '字典数据不存在', data: undefined }
  }
  mockDictDatas.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 根据字典类型获取字典数据 */
export async function getDictsByType(
  dictType: string
): Promise<ApiResult<DictData[]>> {
  await sleep(200)
  const dictDatas = mockDictDatas.filter((d) => d.dictType === dictType)
  return {
    code: 200,
    msg: '查询成功',
    data: dictDatas,
  }
}

// ==================== 系统配置相关 API ====================

/** 获取配置列表 */
export async function configList(
  query: ConfigQuery
): Promise<ApiResult<PageResult<Config>>> {
  await sleep(300)
  let filteredConfigs = [...mockConfigs]

  if (query.configName) {
    filteredConfigs = filteredConfigs.filter((c) =>
      c.configName.includes(query.configName!)
    )
  }
  if (query.configKey) {
    filteredConfigs = filteredConfigs.filter((c) =>
      c.configKey.includes(query.configKey!)
    )
  }
  if (query.configType) {
    filteredConfigs = filteredConfigs.filter(
      (c) => c.configType === query.configType
    )
  }

  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: filteredConfigs.slice(start, end),
      total: filteredConfigs.length,
    },
  }
}

/** 获取配置详情 */
export async function getConfig(configId: number): Promise<ApiResult<Config>> {
  await sleep(200)
  const config = mockConfigs.find((c) => c.configId === configId)
  if (!config) {
    return { code: 404, msg: '配置不存在', data: null as unknown as Config }
  }
  return { code: 200, msg: '查询成功', data: config }
}

/** 新增配置 */
export async function addConfig(data: ConfigForm): Promise<ApiResult<void>> {
  await sleep(300)
  const newConfig: Config = {
    configId: Math.max(...mockConfigs.map((c) => c.configId)) + 1,
    configName: data.configName,
    configKey: data.configKey,
    configValue: data.configValue,
    configType: data.configType,
    remark: data.remark,
    createTime: new Date().toLocaleString(),
  }
  mockConfigs.push(newConfig)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改配置 */
export async function updateConfig(data: ConfigForm): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockConfigs.findIndex((c) => c.configId === data.configId)
  if (index === -1) {
    return { code: 404, msg: '配置不存在', data: undefined }
  }
  mockConfigs[index] = {
    ...mockConfigs[index],
    configName: data.configName,
    configKey: data.configKey,
    configValue: data.configValue,
    configType: data.configType,
    remark: data.remark,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除配置 */
export async function deleteConfig(configId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockConfigs.findIndex((c) => c.configId === configId)
  if (index === -1) {
    return { code: 404, msg: '配置不存在', data: undefined }
  }
  mockConfigs.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

/** 刷新配置缓存 */
export async function refreshConfigCache(): Promise<ApiResult<void>> {
  await sleep(200)
  return { code: 200, msg: '刷新成功', data: undefined }
}

/** 根据配置键名获取配置值 */
export async function getConfigByKey(
  configKey: string
): Promise<ApiResult<string>> {
  await sleep(200)
  const config = mockConfigs.find((c) => c.configKey === configKey)
  if (!config) {
    return { code: 404, msg: '配置不存在', data: '' }
  }
  return { code: 200, msg: '查询成功', data: config.configValue }
}

// ==================== 通知公告相关 API ====================

/** 获取通知公告列表 */
export async function noticeList(
  query: NoticeQuery
): Promise<ApiResult<PageResult<Notice>>> {
  await sleep(300)
  let filteredNotices = [...mockNotices]

  if (query.noticeTitle) {
    filteredNotices = filteredNotices.filter((n) =>
      n.noticeTitle.includes(query.noticeTitle!)
    )
  }
  if (query.noticeType) {
    filteredNotices = filteredNotices.filter(
      (n) => n.noticeType === query.noticeType
    )
  }
  if (query.status) {
    filteredNotices = filteredNotices.filter((n) => n.status === query.status)
  }

  const pageNum = query.pageNum || 1
  const pageSize = query.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: filteredNotices.slice(start, end),
      total: filteredNotices.length,
    },
  }
}

/** 获取通知公告详情 */
export async function getNotice(noticeId: number): Promise<ApiResult<Notice>> {
  await sleep(200)
  const notice = mockNotices.find((n) => n.noticeId === noticeId)
  if (!notice) {
    return { code: 404, msg: '通知公告不存在', data: null as unknown as Notice }
  }
  return { code: 200, msg: '查询成功', data: notice }
}

/** 新增通知公告 */
export async function addNotice(data: NoticeForm): Promise<ApiResult<void>> {
  await sleep(300)
  const newNotice: Notice = {
    noticeId: Math.max(...mockNotices.map((n) => n.noticeId)) + 1,
    noticeTitle: data.noticeTitle,
    noticeType: data.noticeType,
    noticeContent: data.noticeContent,
    status: data.status,
    createByName: 'admin',
    createTime: new Date().toLocaleString(),
    remark: data.remark,
  }
  mockNotices.push(newNotice)
  return { code: 200, msg: '新增成功', data: undefined }
}

/** 修改通知公告 */
export async function updateNotice(data: NoticeForm): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockNotices.findIndex((n) => n.noticeId === data.noticeId)
  if (index === -1) {
    return { code: 404, msg: '通知公告不存在', data: undefined }
  }
  mockNotices[index] = {
    ...mockNotices[index],
    noticeTitle: data.noticeTitle,
    noticeType: data.noticeType,
    noticeContent: data.noticeContent,
    status: data.status,
    remark: data.remark,
  }
  return { code: 200, msg: '修改成功', data: undefined }
}

/** 删除通知公告 */
export async function deleteNotice(noticeId: number): Promise<ApiResult<void>> {
  await sleep(300)
  const index = mockNotices.findIndex((n) => n.noticeId === noticeId)
  if (index === -1) {
    return { code: 404, msg: '通知公告不存在', data: undefined }
  }
  mockNotices.splice(index, 1)
  return { code: 200, msg: '删除成功', data: undefined }
}

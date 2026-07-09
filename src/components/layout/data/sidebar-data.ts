import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutGrid,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Globe,
  Megaphone,
  Archive,
  Headphones,
  Store,
  Settings2,
  DollarSign,
  PieChart,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Kanban',
          url: '/kanban',
          icon: LayoutGrid,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/clerk/sign-up',
            },
            {
              title: 'User Management',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: '电商中心',
      items: [
        {
          title: '数据概览',
          url: '/ecommerce',
          icon: BarChart3,
        },
        {
          title: '销售分析',
          icon: TrendingUp,
          items: [
            {
              title: '销售趋势',
              url: '/ecommerce/sales/trend',
              icon: TrendingUp,
            },
            {
              title: '渠道分析',
              url: '/ecommerce/sales/channel',
              icon: PieChart,
            },
            {
              title: '订单管理',
              url: '/ecommerce/sales/orders',
              icon: ShoppingCart,
            },
          ],
        },
        {
          title: '商品分析',
          icon: Package,
          items: [
            {
              title: '商品列表',
              url: '/ecommerce/products/list',
              icon: Package,
            },
            {
              title: '热销排行',
              url: '/ecommerce/products/hot',
              icon: DollarSign,
            },
            {
              title: '品类分析',
              url: '/ecommerce/products/category',
              icon: PieChart,
            },
          ],
        },
        {
          title: '流量分析',
          url: '/ecommerce/traffic',
          icon: Globe,
        },
        {
          title: '广告投放',
          url: '/ecommerce/ads',
          icon: Megaphone,
        },
        {
          title: '库存管理',
          icon: Archive,
          items: [
            {
              title: '库存概览',
              url: '/ecommerce/inventory',
              icon: Archive,
            },
            {
              title: '补货预警',
              url: '/ecommerce/inventory/alerts',
              icon: Bell,
            },
          ],
        },
        {
          title: '售后中心',
          url: '/ecommerce/aftersales',
          icon: Headphones,
        },
      ],
    },
    {
      title: '电商设置',
      items: [
        {
          title: '店铺管理',
          url: '/ecommerce/settings/stores',
          icon: Store,
        },
        {
          title: '渠道配置',
          url: '/ecommerce/settings/channels',
          icon: Globe,
        },
        {
          title: '数据设置',
          url: '/ecommerce/settings/data',
          icon: Settings2,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
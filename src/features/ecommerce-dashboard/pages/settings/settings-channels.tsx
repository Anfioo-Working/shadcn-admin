import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Store, ShoppingBag, Video, Smartphone, Settings } from 'lucide-react'

interface Channel {
  id: string
  name: string
  icon: React.ReactNode
  enabled: boolean
  status: 'connected' | 'disconnected' | 'pending'
}

const channels: Channel[] = [
  {
    id: 'independent',
    name: '独立站',
    icon: <Store className="size-5" />,
    enabled: true,
    status: 'connected',
  },
  {
    id: 'tiktok',
    name: 'TikTok小店',
    icon: <Video className="size-5" />,
    enabled: true,
    status: 'connected',
  },
  {
    id: 'amazon',
    name: '亚马逊',
    icon: <ShoppingBag className="size-5" />,
    enabled: false,
    status: 'disconnected',
  },
  {
    id: 'douyin',
    name: '抖音商城',
    icon: <Video className="size-5" />,
    enabled: true,
    status: 'pending',
  },
  {
    id: 'miniprogram',
    name: '小程序',
    icon: <Smartphone className="size-5" />,
    enabled: true,
    status: 'connected',
  },
]

function getStatusBadge(status: Channel['status']) {
  switch (status) {
    case 'connected':
      return <Badge variant="default">已连接</Badge>
    case 'disconnected':
      return <Badge variant="secondary">未连接</Badge>
    case 'pending':
      return <Badge variant="outline">同步中</Badge>
  }
}

export function SettingsChannelsPage() {
  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">渠道配置</h1>
      </Header>
      <Main>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {channel.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{channel.name}</h3>
                      {getStatusBadge(channel.status)}
                    </div>
                  </div>
                  <Switch checked={channel.enabled} />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="size-4" />
                    同步设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
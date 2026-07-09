import { faker } from '@faker-js/faker'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// 店铺数据类型
interface Store {
  id: string
  name: string
  platform: string
  status: 'active' | 'inactive' | 'syncing'
  bindTime: string
}

// 使用 faker 生成店铺数据
function generateStores(): Store[] {
  const storeNames = [
    '品牌旗舰一店',
    '跨境专营店',
    'TikTok全球店',
    '亚马逊US店',
    '抖音商城店',
  ]
  const platforms = ['淘宝', '京东', 'TikTok', '亚马逊', '抖音']

  return storeNames.map((name, index) => ({
    id: faker.string.uuid(),
    name,
    platform: platforms[index],
    status: faker.helpers.arrayElement(['active', 'inactive', 'syncing']),
    bindTime: faker.date.past({ years: 2 }).toLocaleDateString('zh-CN'),
  }))
}

const stores = generateStores()

// 状态映射
const statusMap: Record<Store['status'], { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  active: { label: '已激活', variant: 'default' },
  inactive: { label: '未激活', variant: 'secondary' },
  syncing: { label: '同步中', variant: 'outline' },
}

export function SettingsStoresPage() {
  return (
    <>
      <Header>
        <h1 className="text-lg font-semibold">店铺管理</h1>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* 添加店铺按钮 */}
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>添加店铺</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加店铺</DialogTitle>
                  <DialogDescription>
                    填写店铺信息以添加新店铺
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    店铺添加表单内容...
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button>确认添加</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* 店铺卡片展示 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{store.name}</span>
                    <Badge variant={statusMap[store.status].variant}>
                      {statusMap[store.status].label}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{store.platform}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    绑定时间: {store.bindTime}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 店铺列表表格 */}
          <Card>
            <CardHeader>
              <CardTitle>店铺列表</CardTitle>
              <CardDescription>管理您绑定的所有店铺</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>店铺名</TableHead>
                    <TableHead>平台</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>绑定时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.platform}</TableCell>
                      <TableCell>
                        <Badge variant={statusMap[store.status].variant}>
                          {statusMap[store.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{store.bindTime}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            编辑
                          </Button>
                          <Button variant="outline" size="sm">
                            同步
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                删除
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>确认删除</DialogTitle>
                                <DialogDescription>
                                  确定要删除店铺 "{store.name}" 吗？此操作无法撤销。
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">取消</Button>
                                <Button variant="destructive">确认删除</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type WheelEvent,
  type TouchEvent,
} from 'react'
import {
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
  BookmarkIcon,
  MusicIcon,
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  ArrowLeftIcon,
  SearchIcon,
  PlusIcon,
  HomeIcon,
  UsersIcon,
  SendIcon,
  UserIcon,
  MoreHorizontalIcon,
  Link2Icon,
  DownloadIcon,
  AtSignIcon,
  ClockIcon,
  TrendingUpIcon,
  XIcon,
  MapPinIcon,
  CameraIcon,
  ImageIcon,
  RadioIcon,
  FileTextIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ─── 数据类型 ────────────────────────────────────────────────

interface VideoItem {
  id: number
  title: string
  author: string
  avatar: string
  cover: string
  videoUrl: string
  likes: number
  comments: number
  shares: number
  collects: number
  music: string
  description: string
  tags: string[]
  location?: string
  isLive?: boolean
}

interface CommentItem {
  id: number
  user: string
  avatar: string
  text: string
  likes: number
  isLiked: boolean
  time: string
  replies?: CommentItem[]
}

interface UserProfile {
  username: string
  avatar: string
  bio: string
  following: number
  followers: number
  likes: number
  isFollowed: boolean
}

interface MessageItem {
  id: number
  user: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
}

// ─── Mock 数据 ───────────────────────────────────────────────

const mockVideos: VideoItem[] = [
  {
    id: 1,
    title: '美丽的海边日落',
    author: '旅行达人小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    cover:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1920&fit=crop',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    likes: 125800,
    comments: 3260,
    shares: 1890,
    collects: 8920,
    music: '日落 - 轻音乐',
    description:
      '今天在三亚拍到的绝美日落，太治愈了！夕阳把天空染成了橙红色，海面上波光粼粼的，真的很美，推荐大家一定要去看一次海边的日落！',
    tags: ['海边', '日落', '旅行', '治愈'],
    location: '三亚·海棠湾',
  },
  {
    id: 2,
    title: '美食制作教程',
    author: '美食家小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    cover:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1080&h=1920&fit=crop',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: 89200,
    comments: 2150,
    shares: 980,
    collects: 15600,
    music: '烹饪时光 - 纯音乐',
    description: '教你做一道超简单的番茄炒蛋，新手也能学会！',
    tags: ['美食', '教程', '家常菜'],
  },
  {
    id: 3,
    title: '城市夜景航拍',
    author: '摄影师大张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    cover:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1080&h=1920&fit=crop',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    likes: 234500,
    comments: 5670,
    shares: 3450,
    collects: 21000,
    music: 'City Lights - Electronic',
    description: '上海外滩夜景航拍，繁华都市的璀璨灯火',
    tags: ['上海', '夜景', '航拍', '都市'],
    location: '上海·外滩',
  },
  {
    id: 4,
    title: '可爱猫咪日常',
    author: '猫奴小赵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
    cover:
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1080&h=1920&fit=crop',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    likes: 567800,
    comments: 12300,
    shares: 8900,
    collects: 45600,
    music: 'Meow Meow - Cute Song',
    description: '我家猫咪今天又在卖萌了，太可爱了吧！',
    tags: ['猫咪', '萌宠', '日常', '可爱'],
    isLive: true,
  },
  {
    id: 5,
    title: '街舞表演',
    author: '舞者小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    cover:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=1080&h=1920&fit=crop',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    likes: 178900,
    comments: 4560,
    shares: 2340,
    collects: 12300,
    music: 'Dance Beat - Hip Hop',
    description: '街头最炫酷的舞蹈表演，快来围观！',
    tags: ['街舞', '舞蹈', '街头', '表演'],
  },
]

const mockComments: CommentItem[] = [
  {
    id: 1,
    user: '用户8888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1',
    text: '太棒了！拍得真好看',
    likes: 120,
    isLiked: false,
    time: '2小时前',
  },
  {
    id: 2,
    user: '快乐星球',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2',
    text: '这个视频拍得真好，收藏了',
    likes: 89,
    isLiked: false,
    time: '3小时前',
  },
  {
    id: 3,
    user: '路人甲',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3',
    text: '请问这是在哪里拍的呀？想去！',
    likes: 56,
    isLiked: false,
    time: '5小时前',
  },
  {
    id: 4,
    user: '小太阳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4',
    text: '绝了绝了绝了！！',
    likes: 234,
    isLiked: true,
    time: '1天前',
  },
  {
    id: 5,
    user: '旅行爱好者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c5',
    text: '下次带我一起！',
    likes: 45,
    isLiked: false,
    time: '2天前',
  },
]

const mockUserProfiles: Record<string, UserProfile> = {
  旅行达人小王: {
    username: '旅行达人小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    bio: '环球旅行博主 🌍 分享世界各地美景',
    following: 256,
    followers: 128000,
    likes: 5670000,
    isFollowed: false,
  },
  美食家小李: {
    username: '美食家小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    bio: '吃货一枚，分享美食制作教程',
    following: 189,
    followers: 89000,
    likes: 3450000,
    isFollowed: true,
  },
  摄影师大张: {
    username: '摄影师大张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    bio: '城市风光摄影师 | 航拍爱好者',
    following: 345,
    followers: 234000,
    likes: 8900000,
    isFollowed: false,
  },
  猫奴小赵: {
    username: '猫奴小赵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
    bio: '两只猫的铲屎官🐱',
    following: 123,
    followers: 567000,
    likes: 12300000,
    isFollowed: false,
  },
  舞者小陈: {
    username: '舞者小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    bio: '街舞达人 💃 舞蹈是我生命',
    following: 78,
    followers: 178000,
    likes: 4560000,
    isFollowed: true,
  },
}

const mockFollowedUsers = [
  {
    name: '美食家小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    isFollowed: true,
  },
  {
    name: '舞者小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    isFollowed: true,
  },
  {
    name: '搞笑达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=funny',
    isFollowed: true,
  },
  {
    name: '科技小哥',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    isFollowed: true,
  },
  {
    name: '健身教练',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fit',
    isFollowed: true,
  },
]

const mockMessages: MessageItem[] = [
  {
    id: 1,
    user: '美食家小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    lastMessage: '你做的菜看起来好好吃！',
    time: '刚刚',
    unread: 2,
  },
  {
    id: 2,
    user: '旅行达人小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    lastMessage: '下次一起去三亚吧',
    time: '10分钟前',
    unread: 0,
  },
  {
    id: 3,
    user: '摄影师大张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    lastMessage: '照片修好了，发给你看看',
    time: '1小时前',
    unread: 5,
  },
  {
    id: 4,
    user: '猫奴小赵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
    lastMessage: '我家猫又闯祸了😂',
    time: '3小时前',
    unread: 0,
  },
  {
    id: 5,
    user: '舞者小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    lastMessage: '明天的舞蹈比赛你来看吗？',
    time: '昨天',
    unread: 1,
  },
]

const mockSearchTerms = {
  hot: ['三亚旅游', '番茄炒蛋', '上海夜景', '可爱猫咪', '街舞教程', '日落拍摄'],
  history: ['海边日落', '美食教程', '猫咪视频'],
}

const mockFriends = [
  {
    name: '美食家小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    online: true,
  },
  {
    name: '旅行达人小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    online: true,
  },
  {
    name: '摄影师大张',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    online: false,
  },
  {
    name: '猫奴小赵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
    online: true,
  },
  {
    name: '舞者小陈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    online: false,
  },
]

// ─── 工具函数 ────────────────────────────────────────────────

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

// ─── 搜索对话框 ──────────────────────────────────────────────

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchHistory, setSearchHistory] = useState(mockSearchTerms.history)
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = useCallback(
    (term: string) => {
      setSearchValue(term)
      toast.success(`搜索: ${term}`)
      onOpenChange(false)
    },
    [onOpenChange]
  )

  const handleClearHistory = useCallback(() => {
    setSearchHistory([])
    toast.success('搜索历史已清空')
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm rounded-xl'>
        <DialogHeader>
          <DialogTitle>搜索</DialogTitle>
          <DialogDescription className='sr-only'>
            搜索视频内容
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center gap-2'>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchValue.trim()) {
                handleSearch(searchValue.trim())
              }
            }}
            placeholder='搜索你感兴趣的内容'
          />
          <Button
            size='icon'
            className='shrink-0'
            onClick={() => {
              if (searchValue.trim()) handleSearch(searchValue.trim())
            }}
          >
            <SearchIcon className='size-4' />
          </Button>
        </div>

        {/* 热门搜索 */}
        <div>
          <div className='mb-2 flex items-center gap-1.5 text-sm font-medium'>
            <TrendingUpIcon className='size-4 text-red-500' />
            热门搜索
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {mockSearchTerms.hot.map((term) => (
              <Badge
                key={term}
                variant='secondary'
                className='cursor-pointer hover:bg-secondary/80'
                onClick={() => handleSearch(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>

        {/* 搜索历史 */}
        {searchHistory.length > 0 && (
          <div>
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex items-center gap-1.5 text-sm font-medium'>
                <ClockIcon className='size-4 text-muted-foreground' />
                搜索历史
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-auto p-0 text-xs text-muted-foreground'
                onClick={handleClearHistory}
              >
                <XIcon className='mr-1 size-3' />
                清空
              </Button>
            </div>
            <ScrollArea className='h-32'>
              <div className='flex flex-col gap-1'>
                {searchHistory.map((term) => (
                  <Button
                    key={term}
                    variant='ghost'
                    size='sm'
                    className='justify-start text-sm'
                    onClick={() => handleSearch(term)}
                  >
                    <ClockIcon className='mr-2 size-3 text-muted-foreground' />
                    {term}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── 用户资料 Sheet ──────────────────────────────────────────

interface UserProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  authorName: string
}

function UserProfileSheet({
  open,
  onOpenChange,
  authorName,
}: UserProfileSheetProps) {
  const profile = mockUserProfiles[authorName]
  const [isFollowed, setIsFollowed] = useState(profile?.isFollowed ?? false)

  if (!profile) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='flex h-[70vh] flex-col gap-0 p-0'>
        <SheetHeader className='px-4 pt-4'>
          <SheetTitle className='sr-only'>用户资料</SheetTitle>
          <SheetDescription className='sr-only'>
            查看用户详细信息
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='flex-1'>
          <div className='flex flex-col items-center px-4 pb-4'>
            <Avatar className='size-20'>
              <AvatarImage src={profile.avatar} alt={profile.username} />
              <AvatarFallback>{profile.username[0]}</AvatarFallback>
            </Avatar>
            <p className='mt-3 text-base font-bold'>{profile.username}</p>
            <p className='mt-1 text-sm text-muted-foreground'>{profile.bio}</p>

            <div className='mt-4 flex gap-6'>
              <Card className='border-0 shadow-none'>
                <CardContent className='flex flex-col items-center p-2'>
                  <span className='text-base font-bold'>
                    {formatNumber(profile.following)}
                  </span>
                  <span className='text-xs text-muted-foreground'>关注</span>
                </CardContent>
              </Card>
              <Card className='border-0 shadow-none'>
                <CardContent className='flex flex-col items-center p-2'>
                  <span className='text-base font-bold'>
                    {formatNumber(profile.followers)}
                  </span>
                  <span className='text-xs text-muted-foreground'>粉丝</span>
                </CardContent>
              </Card>
              <Card className='border-0 shadow-none'>
                <CardContent className='flex flex-col items-center p-2'>
                  <span className='text-base font-bold'>
                    {formatNumber(profile.likes)}
                  </span>
                  <span className='text-xs text-muted-foreground'>获赞</span>
                </CardContent>
              </Card>
            </div>

            <Button
              className='mt-4 w-40'
              variant={isFollowed ? 'outline' : 'default'}
              onClick={() => {
                setIsFollowed((prev) => !prev)
                toast(isFollowed ? '已取消关注' : '关注成功', {
                  duration: 1500,
                })
              }}
            >
              {isFollowed ? '已关注' : '关注'}
            </Button>

            {/* 视频网格占位 */}
            <div className='mt-4 grid w-full grid-cols-3 gap-1'>
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className='aspect-[3/4] rounded-md' />
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ─── 评论 Sheet 组件 ──────────────────────────────────────────

interface CommentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commentCount: number
}

function CommentSheet({ open, onOpenChange, commentCount }: CommentSheetProps) {
  const [comments, setComments] = useState<CommentItem[]>(mockComments)
  const [commentText, setCommentText] = useState('')
  const [sortTab, setSortTab] = useState('hot')

  const handleLikeComment = useCallback((commentId: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    )
  }, [])

  const handleSendComment = useCallback(() => {
    if (!commentText.trim()) return
    setComments((prev) => [
      {
        id: Date.now(),
        user: '我',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
        text: commentText,
        likes: 0,
        isLiked: false,
        time: '刚刚',
      },
      ...prev,
    ])
    setCommentText('')
    toast.success('评论发送成功')
  }, [commentText])

  const sortedComments =
    sortTab === 'hot'
      ? [...comments].sort((a, b) => b.likes - a.likes)
      : [...comments]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='flex h-[65vh] flex-col gap-0 p-0'>
        <SheetHeader className='border-b px-4 py-3'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='text-sm'>
              {formatNumber(commentCount)} 条评论
            </SheetTitle>
            <Tabs value={sortTab} onValueChange={setSortTab}>
              <TabsList className='h-7 bg-transparent p-0'>
                <TabsTrigger
                  value='hot'
                  className='h-7 px-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none'
                >
                  最热
                </TabsTrigger>
                <TabsTrigger
                  value='new'
                  className='h-7 px-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none'
                >
                  最新
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <SheetDescription className='sr-only'>视频评论区</SheetDescription>
        </SheetHeader>

        <ScrollArea className='flex-1'>
          <div className='px-4 py-3'>
            {sortedComments.map((comment) => (
              <div key={comment.id} className='flex gap-3 py-3'>
                <Avatar className='size-8'>
                  <AvatarImage src={comment.avatar} alt={comment.user} />
                  <AvatarFallback>{comment.user[0]}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <p className='text-xs text-muted-foreground'>
                    {comment.user}
                  </p>
                  <p className='mt-1 text-sm'>{comment.text}</p>
                  <div className='mt-1 flex items-center gap-3 text-xs text-muted-foreground'>
                    <span>{comment.time}</span>
                    <Button
                      variant='link'
                      size='sm'
                      className='h-auto p-0 text-xs text-muted-foreground'
                    >
                      回复
                    </Button>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8 shrink-0'
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <HeartIcon
                    className={cn(
                      'size-4',
                      comment.isLiked
                        ? 'fill-red-500 text-red-500'
                        : 'text-muted-foreground'
                    )}
                  />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className='flex items-center gap-2 border-t p-3'>
          <Avatar className='size-7'>
            <AvatarFallback>我</AvatarFallback>
          </Avatar>
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendComment()
            }}
            placeholder='说点什么...'
            className='flex-1 rounded-full'
          />
          <Button
            size='icon'
            className='size-9 shrink-0'
            onClick={handleSendComment}
          >
            <SendIcon className='size-4' />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── 分享对话框 ──────────────────────────────────────────────

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const shareOptions = [
    { icon: MessageCircleIcon, label: '微信好友' },
    { icon: UsersIcon, label: '朋友圈' },
    { icon: SendIcon, label: 'QQ' },
    { icon: AtSignIcon, label: '微薄' },
    { icon: Link2Icon, label: '复制链接' },
    { icon: DownloadIcon, label: '保存到相册' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xs rounded-xl'>
        <DialogHeader>
          <DialogTitle className='text-center'>分享至</DialogTitle>
          <DialogDescription className='sr-only'>
            分享视频到其他平台
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-3 gap-3'>
          {shareOptions.map((option) => (
            <Button
              key={option.label}
              variant='ghost'
              className='flex h-auto flex-col items-center gap-2 p-3'
              onClick={() => {
                if (option.label === '复制链接') {
                  toast.success('链接已复制到剪贴板')
                } else if (option.label === '保存到相册') {
                  toast.success('已保存到相册')
                } else {
                  toast.success(`已分享到${option.label}`)
                }
                onOpenChange(false)
              }}
            >
              <div className='flex size-10 items-center justify-center rounded-full bg-primary/10'>
                <option.icon className='size-5 text-primary' />
              </div>
              <span className='text-xs text-muted-foreground'>
                {option.label}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── 不感兴趣对话框 ──────────────────────────────────────────

interface NotInterestedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function NotInterestedDialog({ open, onOpenChange }: NotInterestedDialogProps) {
  const reasons = [
    '不感兴趣',
    '已经看过',
    '内容质量差',
    '内容引起不适',
    '涉嫌违规',
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xs rounded-xl'>
        <DialogHeader>
          <DialogTitle className='text-center'>不感兴趣</DialogTitle>
          <DialogDescription className='sr-only'>
            选择不感兴趣的原因
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-1'>
          {reasons.map((reason) => (
            <Button
              key={reason}
              variant='ghost'
              className='justify-start'
              onClick={() => {
                toast.success('将减少推荐此类内容')
                onOpenChange(false)
              }}
            >
              {reason}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── 举报 AlertDialog ────────────────────────────────────────

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ReportAlertDialog({ open, onOpenChange }: ReportDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认举报？</AlertDialogTitle>
          <AlertDialogDescription>
            举报后我们将进行审核，确认违规后将处理该视频。恶意举报可能会导致您的账号受限。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => toast.success('举报已提交，感谢您的反馈')}
          >
            确认举报
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── 关注列表 Sheet ──────────────────────────────────────────

interface FollowListSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FollowListSheet({ open, onOpenChange }: FollowListSheetProps) {
  const [followed, setFollowed] = useState(
    () =>
      new Set(mockFollowedUsers.filter((u) => u.isFollowed).map((u) => u.name))
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='flex h-[60vh] flex-col gap-0 p-0'>
        <SheetHeader className='border-b px-4 py-3'>
          <SheetTitle className='text-center text-sm'>关注列表</SheetTitle>
          <SheetDescription className='sr-only'>
            已关注的用户列表
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className='flex-1'>
          <div className='px-4 py-2'>
            {mockFollowedUsers.map((user) => (
              <div key={user.name} className='flex items-center gap-3 py-3'>
                <Avatar className='size-10'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className='flex-1 text-sm'>{user.name}</span>
                <Button
                  size='sm'
                  variant={followed.has(user.name) ? 'outline' : 'default'}
                  className='h-7 text-xs'
                  onClick={() => {
                    setFollowed((prev) => {
                      const next = new Set(prev)
                      if (next.has(user.name)) next.delete(user.name)
                      else next.add(user.name)
                      return next
                    })
                  }}
                >
                  {followed.has(user.name) ? '已关注' : '关注'}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ─── 消息列表 Sheet ──────────────────────────────────────────

interface MessageSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function MessageSheet({ open, onOpenChange }: MessageSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='flex h-[70vh] flex-col gap-0 p-0'>
        <SheetHeader className='border-b px-4 py-3'>
          <SheetTitle className='text-center text-sm'>消息</SheetTitle>
          <SheetDescription className='sr-only'>消息列表</SheetDescription>
        </SheetHeader>
        <ScrollArea className='flex-1'>
          <div className='px-4 py-2'>
            {mockMessages.map((msg) => (
              <div key={msg.id} className='flex items-center gap-3 py-3'>
                <Avatar className='size-10'>
                  <AvatarImage src={msg.avatar} alt={msg.user} />
                  <AvatarFallback>{msg.user[0]}</AvatarFallback>
                </Avatar>
                <div className='flex-1 overflow-hidden'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>{msg.user}</span>
                    <span className='text-xs text-muted-foreground'>
                      {msg.time}
                    </span>
                  </div>
                  <p className='mt-0.5 truncate text-xs text-muted-foreground'>
                    {msg.lastMessage}
                  </p>
                </div>
                {msg.unread > 0 && (
                  <Badge
                    variant='destructive'
                    className='shrink-0 px-1.5 text-[10px]'
                  >
                    {msg.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ─── 个人中心 Sheet ──────────────────────────────────────────

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const menuItems = [
    { label: '我的收藏', icon: BookmarkIcon },
    { label: '我的点赞', icon: HeartIcon },
    { label: '浏览历史', icon: ClockIcon },
    { label: '设置', icon: ChevronRightIcon },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='flex h-[70vh] flex-col gap-0 p-0'>
        <SheetHeader className='px-4 pt-4'>
          <SheetTitle className='sr-only'>个人中心</SheetTitle>
          <SheetDescription className='sr-only'>用户个人中心</SheetDescription>
        </SheetHeader>
        <ScrollArea className='flex-1'>
          <div className='px-4 pb-4'>
            {/* 用户信息 */}
            <div className='flex items-center gap-3'>
              <Avatar className='size-14'>
                <AvatarImage
                  src='https://api.dicebear.com/7.x/avataaars/svg?seed=me'
                  alt='我'
                />
                <AvatarFallback>我</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-base font-bold'>我的昵称</p>
                <p className='text-xs text-muted-foreground'>
                  抖音号: 123456789
                </p>
              </div>
            </div>

            {/* 统计行 */}
            <div className='mt-4 flex justify-around'>
              <div className='flex flex-col items-center'>
                <span className='text-base font-bold'>12</span>
                <span className='text-xs text-muted-foreground'>关注</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-base font-bold'>256</span>
                <span className='text-xs text-muted-foreground'>粉丝</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-base font-bold'>1.2w</span>
                <span className='text-xs text-muted-foreground'>获赞</span>
              </div>
            </div>

            <Separator className='my-4' />

            {/* 菜单项 */}
            <div className='flex flex-col gap-1'>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant='ghost'
                  className='justify-between px-0'
                  onClick={() => toast.info(`${item.label}`)}
                >
                  <div className='flex items-center gap-3'>
                    <item.icon className='size-4 text-muted-foreground' />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRightIcon className='size-4 text-muted-foreground' />
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ─── 朋友页面 Sheet ──────────────────────────────────────────

interface FriendSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FriendSheet({ open, onOpenChange }: FriendSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='flex h-[60vh] flex-col gap-0 p-0'>
        <SheetHeader className='border-b px-4 py-3'>
          <SheetTitle className='text-center text-sm'>朋友</SheetTitle>
          <SheetDescription className='sr-only'>好友列表</SheetDescription>
        </SheetHeader>
        <ScrollArea className='flex-1'>
          <div className='px-4 py-2'>
            {mockFriends.map((friend) => (
              <div key={friend.name} className='flex items-center gap-3 py-3'>
                <div className='relative'>
                  <Avatar className='size-10'>
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  {friend.online && (
                    <span className='absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-green-500' />
                  )}
                </div>
                <div className='flex-1'>
                  <span className='text-sm'>{friend.name}</span>
                  <p className='text-xs text-muted-foreground'>
                    {friend.online ? '在线' : '离线'}
                  </p>
                </div>
                <Button size='sm' variant='outline' className='h-7 text-xs'>
                  聊天
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ─── 发布 Dialog ─────────────────────────────────────────────

interface PublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PublishDialog({ open, onOpenChange }: PublishDialogProps) {
  const options = [
    { icon: CameraIcon, label: '拍摄' },
    { icon: ImageIcon, label: '相册' },
    { icon: RadioIcon, label: '直播' },
    { icon: FileTextIcon, label: '文字' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xs rounded-xl'>
        <DialogHeader>
          <DialogTitle className='text-center'>创建作品</DialogTitle>
          <DialogDescription className='sr-only'>
            选择创作方式
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-4 gap-3'>
          {options.map((option) => (
            <Button
              key={option.label}
              variant='ghost'
              className='flex h-auto flex-col items-center gap-2 p-3'
              onClick={() => {
                toast.info(`${option.label}功能开发中`)
                onOpenChange(false)
              }}
            >
              <div className='flex size-10 items-center justify-center rounded-full bg-primary/10'>
                <option.icon className='size-5 text-primary' />
              </div>
              <span className='text-xs text-muted-foreground'>
                {option.label}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── 单个视频卡片 ────────────────────────────────────────────

interface VideoCardProps {
  video: VideoItem
  isActive: boolean
  onExit: () => void
  onTabChange: (tab: string) => void
  activeTab: string
  onShowFollowList: () => void
  onShowSearch: () => void
}

function VideoCard({
  video,
  isActive,
  onExit,
  onTabChange,
  activeTab,
  onShowFollowList,
  onShowSearch,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showCommentSheet, setShowCommentSheet] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showNotInterested, setShowNotInterested] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showProfileSheet, setShowProfileSheet] = useState(false)
  const [showPauseOverlay, setShowPauseOverlay] = useState(false)
  const [descOpen, setDescOpen] = useState(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  // 控制视频播放
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      video.currentTime = 0
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    } else {
      video.pause()
    }
  }, [isActive])

  // 监听播放进度
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
    setShowPauseOverlay(true)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => setShowPauseOverlay(false), 800)
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev)
  }, [])

  const handleDoubleTapLike = useCallback(() => {
    if (!isLiked) setIsLiked(true)
  }, [isLiked])

  const handleCollect = useCallback(() => {
    setIsCollected((prev) => !prev)
    toast(isCollected ? '已取消收藏' : '收藏成功', { duration: 1500 })
  }, [isCollected])

  const handleFollow = useCallback(() => {
    setIsFollowed((prev) => !prev)
    toast(isFollowed ? '已取消关注' : '关注成功', { duration: 1500 })
  }, [isFollowed])

  // 双击检测
  const lastTapRef = useRef(0)
  const handleVideoClick = useCallback(() => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      handleDoubleTapLike()
    } else {
      togglePlay()
    }
    lastTapRef.current = now
  }, [togglePlay, handleDoubleTapLike])

  const isLongDesc = video.description.length > 30

  return (
    <div className='relative h-full w-full snap-start bg-black'>
      {/* 加载骨架 */}
      {!isVideoLoaded && (
        <div className='absolute inset-0 z-30'>
          <Skeleton className='size-full rounded-none' />
        </div>
      )}

      {/* 视频 */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.cover}
        muted={isMuted}
        loop
        playsInline
        className='size-full object-cover'
        onClick={handleVideoClick}
        onLoadedData={() => setIsVideoLoaded(true)}
      />

      {/* 渐变遮罩 */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30' />

      {/* 顶部栏 */}
      <div className='pt-safe absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-3'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20'
                onClick={onExit}
              >
                <ArrowLeftIcon className='size-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>返回</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            onTabChange(v)
            if (v === '关注') onShowFollowList()
          }}
        >
          <TabsList className='h-8 bg-transparent'>
            <TabsTrigger
              value='关注'
              className='text-sm text-white/60 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none'
            >
              关注
            </TabsTrigger>
            <TabsTrigger
              value='推荐'
              className='text-sm text-white/60 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none'
            >
              推荐
            </TabsTrigger>
            <TabsTrigger
              value='附近'
              className='text-sm text-white/60 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none'
            >
              附近
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/20'
                onClick={onShowSearch}
              >
                <SearchIcon className='size-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>搜索</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 播放/暂停覆盖层 */}
      {showPauseOverlay && (
        <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
          <div className='rounded-full bg-black/40 p-4'>
            {isPlaying ? (
              <PlayIcon className='size-10 text-white' />
            ) : (
              <PauseIcon className='size-10 text-white' />
            )}
          </div>
        </div>
      )}

      {/* 双击点赞动画 */}
      {isLiked && showPauseOverlay && (
        <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
          <HeartIcon className='size-24 animate-ping fill-red-500 text-red-500' />
        </div>
      )}

      {/* 右侧操作栏 */}
      <div className='absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4'>
        {/* 头像 + 关注 */}
        <div className='relative mb-1'>
          <Button
            variant='ghost'
            className='h-auto w-auto p-0'
            onClick={() => setShowProfileSheet(true)}
          >
            <Avatar className='size-11 border-2 border-white'>
              <AvatarImage src={video.avatar} alt={video.author} />
              <AvatarFallback>{video.author[0]}</AvatarFallback>
            </Avatar>
          </Button>
          {!isFollowed ? (
            <Button
              size='icon'
              className='absolute -bottom-1.5 left-1/2 size-5 -translate-x-1/2 rounded-full'
              onClick={handleFollow}
            >
              <PlusIcon className='size-3' />
            </Button>
          ) : (
            <Badge
              variant='secondary'
              className='absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 text-[10px]'
            >
              已关注
            </Badge>
          )}
        </div>

        {/* 点赞 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className={cn(
                  'h-auto flex-col gap-0.5 text-white hover:bg-white/20',
                  isLiked && 'text-red-500 hover:text-red-500'
                )}
                onClick={handleLike}
              >
                <HeartIcon
                  className={cn('size-7', isLiked && 'fill-current')}
                />
                <span className='text-[10px]'>
                  {formatNumber(video.likes + (isLiked ? 1 : 0))}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>
              {isLiked ? '取消点赞' : '点赞'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 评论 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-auto flex-col gap-0.5 text-white hover:bg-white/20'
                onClick={() => setShowCommentSheet(true)}
              >
                <MessageCircleIcon className='size-7' />
                <span className='text-[10px]'>
                  {formatNumber(video.comments)}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>评论</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 收藏 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className={cn(
                  'h-auto flex-col gap-0.5 text-white hover:bg-white/20',
                  isCollected && 'text-yellow-400 hover:text-yellow-400'
                )}
                onClick={handleCollect}
              >
                <BookmarkIcon
                  className={cn('size-7', isCollected && 'fill-current')}
                />
                <span className='text-[10px]'>
                  {formatNumber(video.collects + (isCollected ? 1 : 0))}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>
              {isCollected ? '取消收藏' : '收藏'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 分享 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-auto flex-col gap-0.5 text-white hover:bg-white/20'
                onClick={() => setShowShareDialog(true)}
              >
                <ShareIcon className='size-7' />
                <span className='text-[10px]'>
                  {formatNumber(video.shares)}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>分享</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 更多操作 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-auto flex-col gap-0.5 text-white hover:bg-white/20'
            >
              <MoreHorizontalIcon className='size-7' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' side='left'>
            <DropdownMenuItem onClick={() => setShowNotInterested(true)}>
              不感兴趣
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
              举报
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.success('已保存到本地')}>
              保存本地
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.success('将不再看到该作者的作品')}
            >
              不看TA的作品
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast.success('链接已复制到剪贴板')
              }}
            >
              复制链接
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 旋转音乐封面 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className='animate-spin-slow size-10 border border-white/20'>
                <AvatarImage src={video.avatar} alt={video.music} />
                <AvatarFallback>
                  <MusicIcon className='size-4 text-white' />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side='left'>{video.music}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 底部视频信息 */}
      <div className='absolute right-20 bottom-16 left-3 z-20 text-white'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            className='h-auto p-0 text-base font-bold text-white hover:bg-transparent'
            onClick={() => setShowProfileSheet(true)}
          >
            @{video.author}
          </Button>
          {isFollowed && (
            <Badge variant='secondary' className='text-[10px]'>
              已关注
            </Badge>
          )}
        </div>

        {/* 描述文本 - 使用 Collapsible */}
        {isLongDesc ? (
          <Collapsible
            open={descOpen}
            onOpenChange={setDescOpen}
            className='mt-1.5'
          >
            <CollapsibleTrigger className='text-sm leading-relaxed'>
              {descOpen
                ? video.description
                : video.description.slice(0, 30) + '...'}
              <span className='ml-1 text-xs text-white/70'>
                {descOpen ? '收起' : '展开'}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className='text-sm leading-relaxed'>{video.description}</p>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <p className='mt-1.5 text-sm leading-relaxed'>{video.description}</p>
        )}

        {/* 标签 */}
        <div className='mt-1.5 flex flex-wrap gap-1.5'>
          {video.tags.map((tag) => (
            <Badge
              key={tag}
              variant='outline'
              className='border-white/30 text-[11px] text-white hover:bg-white/10'
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* 位置 */}
        {video.location && (
          <div className='mt-1.5 flex items-center gap-1'>
            <MapPinIcon className='size-3 shrink-0' />
            <Badge
              variant='outline'
              className='border-white/30 text-[11px] text-white hover:bg-white/10'
            >
              {video.location}
            </Badge>
          </div>
        )}

        {/* 直播标识 */}
        {video.isLive && (
          <Badge
            variant='destructive'
            className='mt-1.5 animate-pulse text-[10px]'
          >
            直播中
          </Badge>
        )}

        {/* 音乐名滚动 */}
        <div className='mt-2 flex items-center gap-2'>
          <MusicIcon className='size-3 shrink-0' />
          <div className='overflow-hidden'>
            <span className='animate-marquee inline-block text-xs whitespace-nowrap'>
              {video.music}&nbsp;&nbsp;&nbsp;{video.music}
            </span>
          </div>
        </div>
      </div>

      {/* 静音按钮 */}
      <div className='absolute bottom-28 left-3 z-20'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='secondary'
                size='icon'
                className='size-8 bg-black/50 hover:bg-black/70'
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeXIcon className='size-4' />
                ) : (
                  <Volume2Icon className='size-4' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              {isMuted ? '取消静音' : '静音'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 进度条 */}
      <div className='absolute right-0 bottom-14 left-0 z-20'>
        <Progress value={progress} className='h-0.5 rounded-none bg-white/20' />
      </div>

      {/* 各类 Sheet/Dialog */}
      <CommentSheet
        open={showCommentSheet}
        onOpenChange={setShowCommentSheet}
        commentCount={video.comments}
      />
      <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} />
      <NotInterestedDialog
        open={showNotInterested}
        onOpenChange={setShowNotInterested}
      />
      <ReportAlertDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
      />
      <UserProfileSheet
        key={video.author}
        open={showProfileSheet}
        onOpenChange={setShowProfileSheet}
        authorName={video.author}
      />
    </div>
  )
}

// ─── 主抖音页面 ──────────────────────────────────────────────

export function TikTokPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('推荐')
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const [showFollowList, setShowFollowList] = useState(false)
  const [showMessageSheet, setShowMessageSheet] = useState(false)
  const [showProfileSheet, setShowProfileSheet] = useState(false)
  const [showFriendSheet, setShowFriendSheet] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isScrolling = useRef(false)

  const handleExit = useCallback(() => {
    window.history.back()
  }, [])

  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (isScrolling.current) return
      const direction = e.deltaY > 0 ? 1 : -1
      const newIndex = currentIndex + direction
      if (newIndex >= 0 && newIndex < mockVideos.length) {
        isScrolling.current = true
        setCurrentIndex(newIndex)
        scrollToIndex(newIndex)
        setTimeout(() => {
          isScrolling.current = false
        }, 800)
      }
    },
    [currentIndex, scrollToIndex]
  )

  const touchStartY = useRef(0)
  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (isScrolling.current) return
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(deltaY) < 80) return
      const direction = deltaY > 0 ? 1 : -1
      const newIndex = currentIndex + direction
      if (newIndex >= 0 && newIndex < mockVideos.length) {
        isScrolling.current = true
        setCurrentIndex(newIndex)
        scrollToIndex(newIndex)
        setTimeout(() => {
          isScrolling.current = false
        }, 500)
      }
    },
    [currentIndex, scrollToIndex]
  )

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const newIndex = Math.round(scrollTop / window.innerHeight)
    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < mockVideos.length
    ) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex])

  const totalUnread = mockMessages.reduce((sum, m) => sum + m.unread, 0)

  return (
    <div className='fixed inset-0 z-50 bg-black'>
      {/* 视频容器 */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        className='no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth'
      >
        {mockVideos.map((video, index) => (
          <div
            key={video.id}
            className='h-[100svh] w-full'
            style={{ scrollSnapAlign: 'start' }}
          >
            <VideoCard
              video={video}
              isActive={index === currentIndex}
              onExit={handleExit}
              onTabChange={setActiveTab}
              activeTab={activeTab}
              onShowFollowList={() => setShowFollowList(true)}
              onShowSearch={() => setShowSearchDialog(true)}
            />
          </div>
        ))}
      </div>

      {/* 底部导航栏 */}
      <div className='absolute right-0 bottom-0 left-0 z-30'>
        <Separator className='bg-white/10' />
        <div className='pb-safe flex items-center justify-around bg-black/90 px-2 pt-2 backdrop-blur-lg'>
          {/* 首页 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex h-auto flex-col items-center gap-0.5 px-4 py-1 text-white'
                >
                  <HomeIcon className='size-5' />
                  <span className='text-[10px]'>首页</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>首页</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 朋友 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex h-auto flex-col items-center gap-0.5 px-4 py-1 text-white/50'
                  onClick={() => setShowFriendSheet(true)}
                >
                  <UsersIcon className='size-5' />
                  <span className='text-[10px]'>朋友</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>朋友</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 发布 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex h-auto flex-col items-center gap-0.5 px-4 py-1'
                  onClick={() => setShowPublishDialog(true)}
                >
                  <div className='flex size-8 items-center justify-center rounded-md bg-primary'>
                    <PlusIcon className='size-5 text-white' />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>发布</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 消息 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative flex h-auto flex-col items-center gap-0.5 px-4 py-1 text-white/50'
                  onClick={() => setShowMessageSheet(true)}
                >
                  <MessageCircleIcon className='size-5' />
                  <span className='text-[10px]'>消息</span>
                  {totalUnread > 0 && (
                    <Badge
                      variant='destructive'
                      className='absolute -top-1 right-2 px-1 text-[8px]'
                    >
                      {totalUnread}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>消息</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* 我 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex h-auto flex-col items-center gap-0.5 px-4 py-1 text-white/50'
                  onClick={() => setShowProfileSheet(true)}
                >
                  <UserIcon className='size-5' />
                  <span className='text-[10px]'>我</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>我</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* 全局 Sheet / Dialog */}
      <SearchDialog
        open={showSearchDialog}
        onOpenChange={setShowSearchDialog}
      />
      <FollowListSheet open={showFollowList} onOpenChange={setShowFollowList} />
      <MessageSheet
        open={showMessageSheet}
        onOpenChange={setShowMessageSheet}
      />
      <ProfileSheet
        open={showProfileSheet}
        onOpenChange={setShowProfileSheet}
      />
      <FriendSheet open={showFriendSheet} onOpenChange={setShowFriendSheet} />
      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
      />
    </div>
  )
}

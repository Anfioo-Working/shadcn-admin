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
  Volume2Icon,
  VolumeXIcon,
  ArrowLeftIcon,
  SearchIcon,
  PlusIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

// 视频数据
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
}

// 生成 mock 视频数据
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
    description: '今天在三亚拍到的绝美日落，太治愈了 #海边 #日落 #旅行',
    tags: ['海边', '日落', '旅行', '治愈'],
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
    description: '教你做一道超简单的番茄炒蛋，新手也能学会！#美食 #教程 #家常菜',
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
    description: '上海外滩夜景航拍，繁华都市的璀璨灯火 #上海 #夜景 #航拍',
    tags: ['上海', '夜景', '航拍', '都市'],
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
    description: '我家猫咪今天又在卖萌了，太可爱了吧！#猫咪 #萌宠 #日常',
    tags: ['猫咪', '萌宠', '日常', '可爱'],
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
    description: '街头最炫酷的舞蹈表演，快来围观！#街舞 #舞蹈 #街头',
    tags: ['街舞', '舞蹈', '街头', '表演'],
  },
]

// 顶部 Tab
const TABS = ['关注', '推荐', '附近'] as const

// 格式化数字
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 单个视频卡片
interface VideoCardProps {
  video: VideoItem
  isActive: boolean
  onExit: () => void
}

function VideoCard({ video, isActive, onExit }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [showCommentSheet, setShowCommentSheet] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<
    { id: number; user: string; avatar: string; text: string; likes: number }[]
  >([
    {
      id: 1,
      user: '用户8888',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1',
      text: '太棒了！',
      likes: 120,
    },
    {
      id: 2,
      user: '快乐星球',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2',
      text: '这个视频拍得真好',
      likes: 89,
    },
    {
      id: 3,
      user: '路人甲',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3',
      text: '收藏了，慢慢看',
      likes: 56,
    },
  ])

  // 控制视频播放
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.currentTime = 0
      void video.play().then(() => setIsPlaying(true)).catch(() => {})
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
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev)
    toast(isLiked ? '已取消点赞' : '点赞成功', { duration: 1500 })
  }, [isLiked])

  const handleCollect = useCallback(() => {
    setIsCollected((prev) => !prev)
    toast(isCollected ? '已取消收藏' : '收藏成功', { duration: 1500 })
  }, [isCollected])

  const handleFollow = useCallback(() => {
    setIsFollowed((prev) => !prev)
    toast(isFollowed ? '已取消关注' : '关注成功', { duration: 1500 })
  }, [isFollowed])

  const handleShare = useCallback(() => {
    toast('链接已复制到剪贴板', { duration: 1500 })
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
      },
      ...prev,
    ])
    setCommentText('')
    toast('评论发送成功', { duration: 1500 })
  }, [commentText])

  return (
    <div className='relative h-full w-full snap-start bg-black'>
      {/* 视频背景 */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.cover}
        muted={isMuted}
        loop
        playsInline
        className='size-full object-cover'
        onClick={togglePlay}
      />

      {/* 渐变遮罩 */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40' />

      {/* 顶部栏 */}
      <div className='absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-12'>
        <Button
          variant='ghost'
          size='icon'
          className='text-white hover:bg-white/20'
          onClick={onExit}
        >
          <ArrowLeftIcon className='size-6' />
        </Button>

        <div className='flex items-center gap-6 text-white'>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={cn(
                'text-base font-medium transition-opacity',
                tab === '推荐' ? 'opacity-100' : 'opacity-60'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button
          variant='ghost'
          size='icon'
          className='text-white hover:bg-white/20'
        >
          <SearchIcon className='size-5' />
        </Button>
      </div>

      {/* 暂停指示器 */}
      {!isPlaying && (
        <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
          <div className='rounded-full bg-black/40 p-6'>
            <PlayIcon className='size-12 text-white' />
          </div>
        </div>
      )}

      {/* 右侧操作栏 */}
      <div className='absolute bottom-32 right-3 z-20 flex flex-col items-center gap-5'>
        {/* 头像 + 关注 */}
        <div className='relative mb-2'>
          <Avatar className='size-12 border-2 border-white'>
            <AvatarImage src={video.avatar} alt={video.author} />
            <AvatarFallback>{video.author[0]}</AvatarFallback>
          </Avatar>
          {!isFollowed && (
            <button
              onClick={handleFollow}
              className='absolute -bottom-2 left-1/2 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-primary'
            >
              <PlusIcon className='size-3 text-white' />
            </button>
          )}
        </div>

        {/* 点赞 */}
        <button
          onClick={handleLike}
          className='flex flex-col items-center gap-1'
        >
          <HeartIcon
            className={cn(
              'size-8 transition-transform active:scale-125',
              isLiked ? 'fill-red-500 text-red-500' : 'text-white'
            )}
          />
          <span className='text-xs text-white'>
            {formatNumber(video.likes + (isLiked ? 1 : 0))}
          </span>
        </button>

        {/* 评论 */}
        <button
          onClick={() => setShowCommentSheet(true)}
          className='flex flex-col items-center gap-1'
        >
          <MessageCircleIcon className='size-8 text-white' />
          <span className='text-xs text-white'>
            {formatNumber(video.comments)}
          </span>
        </button>

        {/* 收藏 */}
        <button
          onClick={handleCollect}
          className='flex flex-col items-center gap-1'
        >
          <BookmarkIcon
            className={cn(
              'size-8 transition-transform active:scale-125',
              isCollected ? 'fill-yellow-400 text-yellow-400' : 'text-white'
            )}
          />
          <span className='text-xs text-white'>
            {formatNumber(video.collects + (isCollected ? 1 : 0))}
          </span>
        </button>

        {/* 分享 */}
        <button
          onClick={handleShare}
          className='flex flex-col items-center gap-1'
        >
          <ShareIcon className='size-8 text-white' />
          <span className='text-xs text-white'>
            {formatNumber(video.shares)}
          </span>
        </button>

        {/* 旋转的音乐封面 */}
        <div className='mt-2 size-10 animate-spin-slow rounded-full border border-white/30 bg-gradient-to-br from-primary/80 to-primary'>
          <div className='flex size-full items-center justify-center'>
            <MusicIcon className='size-4 text-white' />
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className='absolute bottom-20 left-4 right-20 z-20 text-white'>
        <h3 className='mb-2 text-base font-semibold'>@{video.author}</h3>
        <p className='mb-2 text-sm leading-relaxed'>{video.description}</p>
        <div className='mb-2 flex flex-wrap gap-2'>
          {video.tags.map((tag) => (
            <span key={tag} className='text-sm text-primary'>
              #{tag}
            </span>
          ))}
        </div>
        <div className='flex items-center gap-2 text-xs'>
          <MusicIcon className='size-3' />
          <span className='truncate'>{video.music}</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className='absolute bottom-16 left-0 right-0 z-20 px-4'>
        <Progress value={progress} className='h-0.5 bg-white/30' />
      </div>

      {/* 静音指示器 */}
      {isMuted && (
        <button
          onClick={toggleMute}
          className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 p-4'
        >
          <VolumeXIcon className='size-6 text-white' />
        </button>
      )}

      {/* 取消静音按钮 */}
      {!isMuted && (
        <Button
          variant='ghost'
          size='icon'
          className='absolute bottom-32 left-4 z-20 text-white hover:bg-white/20'
          onClick={toggleMute}
        >
          <Volume2Icon className='size-5' />
        </Button>
      )}

      {/* 评论 Sheet */}
      <Sheet open={showCommentSheet} onOpenChange={setShowCommentSheet}>
        <SheetContent
          side='bottom'
          className='flex h-[60vh] flex-col gap-0 p-0'
        >
          <SheetHeader className='border-b px-4 py-3'>
            <SheetTitle className='text-center text-base'>
              {formatNumber(video.comments)} 条评论
            </SheetTitle>
            <SheetDescription className='sr-only'>评论区</SheetDescription>
          </SheetHeader>

          {/* 评论列表 */}
          <div className='flex-1 overflow-y-auto px-4 py-3'>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className='flex gap-3 py-3'
              >
                <Avatar className='size-9'>
                  <AvatarImage src={comment.avatar} alt={comment.user} />
                  <AvatarFallback>{comment.user[0]}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <p className='text-sm text-muted-foreground'>
                    {comment.user}
                  </p>
                  <p className='text-sm'>{comment.text}</p>
                  <div className='mt-1 flex items-center gap-3 text-xs text-muted-foreground'>
                    <span>2小时前</span>
                    <button>回复</button>
                  </div>
                </div>
                <button className='flex flex-col items-center gap-1'>
                  <HeartIcon className='size-4 text-muted-foreground' />
                  <span className='text-xs text-muted-foreground'>
                    {formatNumber(comment.likes)}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* 评论输入框 */}
          <div className='flex items-center gap-2 border-t p-3'>
            <input
              type='text'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendComment()
              }}
              placeholder='说点什么...'
              className='flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none'
            />
            <Button size='sm' onClick={handleSendComment}>
              发送
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// 主抖音页面组件
export function TikTokPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // 退出
  const handleExit = useCallback(() => {
    window.history.back()
  }, [])

  // 滚轮翻页
  const handleWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (isScrolling.current) return

      const direction = e.deltaY > 0 ? 1 : -1
      const newIndex = currentIndex + direction

      if (newIndex >= 0 && newIndex < mockVideos.length) {
        isScrolling.current = true
        setCurrentIndex(newIndex)

        // 滚动到对应位置
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: newIndex * window.innerHeight,
            behavior: 'smooth',
          })
        }

        // 防抖
        setTimeout(() => {
          isScrolling.current = false
        }, 800)
      }
    },
    [currentIndex]
  )

  // 触摸滑动翻页
  const touchStartY = useRef(0)
  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (isScrolling.current) return

      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const threshold = 80 // 滑动阈值

      if (Math.abs(deltaY) < threshold) return

      const direction = deltaY > 0 ? 1 : -1
      const newIndex = currentIndex + direction

      if (newIndex >= 0 && newIndex < mockVideos.length) {
        isScrolling.current = true
        setCurrentIndex(newIndex)

        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: newIndex * window.innerHeight,
            behavior: 'smooth',
          })
        }

        setTimeout(() => {
          isScrolling.current = false
        }, 500)
      }
    },
    [currentIndex]
  )

  // 监听原生滚动
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const newIndex = Math.round(scrollTop / window.innerHeight)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < mockVideos.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex])

  // 底部导航栏配置
  const bottomNav = [
    { icon: '🏠', label: '首页', active: true },
    { icon: '👥', label: '朋友', active: false },
    { icon: '➕', label: '', active: false },
    { icon: '💬', label: '消息', active: false },
    { icon: '👤', label: '我', active: false },
  ]

  return (
    <div className='fixed inset-0 z-50 bg-black'>
      {/* 视频容器 */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        className='h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth'
        style={{ scrollbarWidth: 'none' }}
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
            />
          </div>
        ))}
      </div>

      {/* 底部导航栏 */}
      <div className='absolute bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-white/10 bg-black/90 px-2 pb-6 pt-2 backdrop-blur-lg'>
        {bottomNav.map((nav, index) => (
          <button
            key={index}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1',
              nav.active ? 'text-white' : 'text-white/60'
            )}
          >
            {nav.label === '' ? (
              <div className='flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70'>
                <PlusIcon className='size-6 text-white' />
              </div>
            ) : (
              <>
                <span className='text-xl'>{nav.icon}</span>
                <span className='text-xs'>{nav.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

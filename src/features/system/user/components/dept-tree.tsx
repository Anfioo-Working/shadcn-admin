'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { ChevronRightIcon, ChevronDownIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { deptTree } from '@/features/system/shared/api'
import type { Dept } from '@/features/system/shared/types'

// Re-export types for convenience
export type { Dept }

interface DeptTreeProps {
  onDeptSelect: (deptId: number | undefined) => void
  selectedDeptId?: number | undefined
}

// 树节点组件
interface TreeNodeProps {
  dept: Dept
  level: number
  expanded: boolean
  selected: boolean
  searchTerm: string
  onToggle: (deptId: number) => void
  onSelect: (deptId: number) => void
}

function TreeNode({
  dept,
  level,
  expanded,
  selected,
  searchTerm,
  onToggle,
  onSelect,
}: TreeNodeProps) {
  const hasChildren = dept.children && dept.children.length > 0
  const indentStyle = { paddingLeft: `${level * 16 + 8}px` }

  // 搜索过滤
  const isMatch = !searchTerm || dept.deptName.includes(searchTerm)

  // 检查子节点是否有匹配
  const childrenHaveMatch = useMemo(() => {
    if (!searchTerm || !dept.children) return false
    return dept.children.some((child) => {
      const childHasMatch = child.deptName.includes(searchTerm)
      const grandchildrenMatch = child.children?.some((grandchild) =>
        grandchild.deptName.includes(searchTerm)
      )
      return childHasMatch || grandchildrenMatch || false
    })
  }, [searchTerm, dept.children])

  // 如果有搜索词且不匹配且子节点也不匹配，则隐藏
  if (searchTerm && !isMatch && !childrenHaveMatch) {
    return null
  }

  return (
    <>
      <div
        className={cn(
          'flex cursor-pointer items-center gap-1 rounded-md py-1.5 transition-colors',
          'hover:bg-accent',
          selected && 'bg-accent font-medium'
        )}
        style={indentStyle}
        onClick={() => onSelect(dept.deptId)}
      >
        {hasChildren && (
          <button
            className='flex size-4 items-center justify-center'
            onClick={(e) => {
              e.stopPropagation()
              onToggle(dept.deptId)
            }}
          >
            {expanded ? (
              <ChevronDownIcon className='size-4 text-muted-foreground' />
            ) : (
              <ChevronRightIcon className='size-4 text-muted-foreground' />
            )}
          </button>
        )}
        {!hasChildren && <span className='size-4' />}
        <span
          className={cn(
            'text-sm',
            dept.status === '1' && 'text-muted-foreground'
          )}
        >
          {dept.deptName}
        </span>
      </div>
      {hasChildren && expanded && (
        <div>
          {dept.children!.map((child) => (
            <TreeNode
              key={child.deptId}
              dept={child}
              level={level + 1}
              expanded={isMatch || childrenHaveMatch}
              selected={
                child.deptId === (searchTerm ? dept.deptId : child.deptId)
              }
              searchTerm={searchTerm}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function DeptTree({ onDeptSelect, selectedDeptId }: DeptTreeProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [deptData, setDeptData] = useState<Dept[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)

  // 加载部门数据
  React.useEffect(() => {
    const loadDeptData = async () => {
      setLoading(true)
      try {
        const res = await deptTree()
        if (res.code === 200) {
          setDeptData(res.data)
          // 默认展开第一层
          const firstLevelIds = new Set(
            res.data.filter((d) => d.parentId === 0).map((d) => d.deptId)
          )
          setExpandedIds(firstLevelIds)
        }
      } finally {
        setLoading(false)
      }
    }
    loadDeptData()
  }, [])

  // 搜索时自动展开所有
  React.useEffect(() => {
    void (async () => {
      if (searchTerm) {
        const allIds = new Set<number>()
        const collectIds = (depts: Dept[]) => {
          depts.forEach((d) => {
            if (d.children && d.children.length > 0) {
              allIds.add(d.deptId)
              collectIds(d.children)
            }
          })
        }
        collectIds(deptData)
        setExpandedIds(allIds)
      }
    })()
  }, [searchTerm, deptData])

  const handleToggle = (deptId: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(deptId)) {
        newSet.delete(deptId)
      } else {
        newSet.add(deptId)
      }
      return newSet
    })
  }

  const handleSelect = (deptId: number) => {
    onDeptSelect(deptId)
  }

  const handleClearSelect = () => {
    onDeptSelect(undefined)
    setSearchTerm('')
  }

  return (
    <Card className='h-full'>
      <CardContent className='p-4'>
        <div className='flex items-center gap-2'>
          <div className='relative flex-1'>
            <SearchIcon className='absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='请输入部门名称'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8'
            />
          </div>
        </div>
        <div className='mt-4 overflow-auto'>
          {/* 清除选择按钮 */}
          <div
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-md py-1.5 transition-colors',
              'hover:bg-accent',
              selectedDeptId === undefined && 'bg-accent font-medium'
            )}
            style={{ paddingLeft: '8px' }}
            onClick={handleClearSelect}
          >
            <span className='size-4' />
            <span className='text-sm text-muted-foreground'>全部用户</span>
          </div>
          {/* 树节点 */}
          {loading ? (
            <div className='py-4 text-center text-sm text-muted-foreground'>
              加载中...
            </div>
          ) : (
            deptData.map((dept) => (
              <TreeNode
                key={dept.deptId}
                dept={dept}
                level={0}
                expanded={expandedIds.has(dept.deptId) || !!searchTerm}
                selected={selectedDeptId === dept.deptId}
                searchTerm={searchTerm}
                onToggle={handleToggle}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

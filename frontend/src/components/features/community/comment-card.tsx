import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useUpdateComment } from '@/hooks/use-posts'
import type { Comment } from '@/types'
import { Edit3 } from 'lucide-react'

interface CommentCardProps {
  comment: Comment
  onDelete: (id: number) => void
  isDeletePending?: boolean
  postId: number
}

export function CommentCard({ comment, onDelete, isDeletePending, postId }: CommentCardProps) {
  const [confirming, setConfirming] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const { user } = useAuthStore()
  const updateComment = useUpdateComment(postId)
  const isOwner = user?.id && comment.user_id && user.id === comment.user_id
  const date = new Date(comment.created_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setEditing(false)
      return
    }
    await updateComment.mutateAsync({ commentId: comment.id, data: { content: editContent } })
    setEditing(false)
  }

  return (
    <div className="py-3 first:pt-0 last:pb-0 border-b border-border last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-fg-primary">
              {comment.is_anonymous ? 'Ẩn danh' : (comment.author?.name ?? comment.guest_name ?? 'Người dùng')}
            </span>
            {comment.is_anonymous && <span className="text-[10px] bg-surface-hover px-1.5 py-0.5 rounded text-fg-tertiary">Ẩn</span>}
            <time className="text-xs text-fg-tertiary" dateTime={comment.created_at}>
              {date}
            </time>
          </div>
          {editing ? (
            <div className="space-y-2">
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3}
                className="w-full rounded-xl bg-canvas border border-border px-3 py-2 text-sm text-fg-primary outline-none focus:border-accent-sage resize-none" />
              <div className="flex gap-2">
                <button type="button" onClick={handleEdit} disabled={updateComment.isPending || !editContent.trim()}
                  className="text-xs rounded-full bg-accent-sage text-white px-3 py-1 hover:bg-accent-sage/90 disabled:opacity-50">
                  {updateComment.isPending ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button type="button" onClick={() => { setEditing(false); setEditContent(comment.content) }}
                  className="text-xs rounded-full border border-border px-3 py-1 text-fg-secondary hover:bg-surface-hover">
                  Huỷ
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-fg-secondary leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="shrink-0 flex items-center gap-1">
            {!editing && (
              <button type="button" onClick={() => setEditing(true)}
                className="text-fg-tertiary hover:text-accent-sage transition-colors p-1 rounded"
                aria-label="Chỉnh sửa bình luận">
                <Edit3 size={14} />
              </button>
            )}
            {confirming ? (
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => { onDelete(comment.id); setConfirming(false) }}
                  disabled={isDeletePending}
                  className="text-xs rounded-full bg-crisis text-white px-2.5 py-1 hover:bg-crisis/90">
                  Xoá
                </button>
                <button type="button" onClick={() => setConfirming(false)}
                  className="text-xs rounded-full border border-border px-2.5 py-1 text-fg-secondary hover:bg-surface-hover">
                  Huỷ
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirming(true)}
                className="text-fg-tertiary hover:text-crisis transition-colors p-1 rounded"
                aria-label="Xóa bình luận">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

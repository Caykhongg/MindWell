import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePost, useUpdatePost } from '@/hooks/use-posts'
import { useAuthStore } from '@/stores/auth-store'

export function PostEdit() {
  const { id } = useParams<{ id: string }>()
  const postId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: post, isLoading } = usePost(postId)
  const updatePost = useUpdatePost()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
      setIsAnonymous(post.is_anonymous)
    }
  }, [post])

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-8 bg-surface-hover rounded animate-pulse w-3/4" /></div>

  if (!post || (user?.id !== post.user_id && user?.role !== 'admin')) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-fg-tertiary text-sm">Bạn không có quyền chỉnh sửa bài viết này.</p>
        <Link to="/community" className="text-accent-sage text-sm mt-2 inline-block">Quay lại</Link>
      </main>
    )
  }

  const handleSubmit = async () => {
    await updatePost.mutateAsync({ id: postId, data: { title, content, isAnonymous } })
    navigate(`/community/${postId}`)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link to={`/community/${postId}`} className="text-sm text-fg-tertiary hover:text-accent-sage mb-6 inline-block">
        ← Quay lại bài viết
      </Link>
      <h1 className="font-serif text-2xl text-fg-primary mb-6">Chỉnh sửa bài viết</h1>

      <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-fg-secondary mb-1.5">Tiêu đề</label>
          <input id="edit-title" type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-fg-primary outline-none focus:border-accent-sage" />
        </div>
        <div>
          <label htmlFor="edit-content" className="block text-sm font-medium text-fg-secondary mb-1.5">Nội dung</label>
          <textarea id="edit-content" value={content} onChange={e => setContent(e.target.value)} rows={8}
            className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-fg-primary outline-none focus:border-accent-sage resize-none" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="accent-accent-sage" />
          <span className="text-sm text-fg-secondary">Đăng ẩn danh</span>
        </label>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={() => navigate(`/community/${postId}`)}
            className="rounded-full border border-border px-6 py-2 text-sm text-fg-secondary hover:bg-surface-hover">
            Huỷ
          </button>
          <button type="button" onClick={handleSubmit} disabled={updatePost.isPending || !title || !content}
            className="rounded-full bg-accent-sage text-white px-6 py-2 text-sm font-medium hover:bg-accent-sage/90 disabled:opacity-50">
            {updatePost.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </main>
  )
}

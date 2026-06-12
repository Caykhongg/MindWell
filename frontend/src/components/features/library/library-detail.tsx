import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '@/lib/api'

interface Article {
  id: number
  author_id: number
  title: string
  content: string
  category: string
  status: string
  tags: string | null
  created_at: string
  updated_at: string
}

export function LibraryDetail() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      try {
        const res = await api.get(`library/articles/${id}`).json<{ success: boolean; data: Article }>()
        setArticle(res.data)
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-surface-hover rounded" />
          <div className="h-6 w-3/4 bg-surface-hover rounded" />
          <div className="h-3 w-1/4 bg-surface-hover rounded" />
          <div className="h-40 bg-surface-hover rounded" />
        </div>
      </main>
    )
  }

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-fg-tertiary">Không tìm thấy bài viết</p>
        <Link to="/library" className="text-accent-sage text-sm mt-4 inline-block">Quay lại thư viện</Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/library" className="text-sm text-accent-sage hover:underline mb-6 inline-block">
        ← Quay lại thư viện
      </Link>
      <article>
        <div className="flex items-center gap-3 mb-4">
          <span className="rounded-full bg-accent-sage-surface px-3 py-0.5 text-xs text-accent-sage font-medium">
            {article.category}
          </span>
        </div>
        <h1 className="font-serif text-3xl text-fg-primary mb-4">{article.title}</h1>
        <p className="text-xs text-fg-disabled mb-8">
          {new Date(article.created_at).toLocaleDateString('vi-VN')}
        </p>
        <div className="prose prose-sm max-w-none text-fg-secondary leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </article>
    </main>
  )
}

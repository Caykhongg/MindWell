import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

export function LibraryPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const url = selectedCategory ? `library/articles?category=${encodeURIComponent(selectedCategory)}` : 'library/articles'
        const [articlesRes, catsRes] = await Promise.all([
          api.get(url).json<{ success: boolean; data: Article[] }>(),
          api.get('library/articles/categories').json<{ success: boolean; data: string[] }>(),
        ])
        setArticles(articlesRes.data ?? [])
        setCategories(catsRes.data ?? [])
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetch()
  }, [selectedCategory])

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-fg-primary">Thư viện cảm xúc</h1>
          <p className="text-sm text-fg-tertiary mt-1">Bài viết tâm lý từ chuyên gia tư vấn</p>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !selectedCategory ? 'bg-accent-sage text-white' : 'border border-border text-fg-secondary hover:bg-surface-hover'
            }`}
          >
            Tất cả
          </button>
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === c ? 'bg-accent-sage text-white' : 'border border-border text-fg-secondary hover:bg-surface-hover'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-6 animate-pulse">
              <div className="h-4 w-48 bg-surface-hover rounded mb-3" />
              <div className="h-3 w-full bg-surface-hover rounded mb-2" />
              <div className="h-3 w-3/4 bg-surface-hover rounded" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-fg-tertiary text-sm">Chưa có bài viết nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map(a => (
            <Link
              key={a.id}
              to={`/library/${a.id}`}
              className="block rounded-2xl border border-border bg-surface p-6 hover:shadow-sm transition-shadow no-underline group"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="rounded-full bg-accent-sage-surface px-3 py-0.5 text-xs text-accent-sage font-medium">
                  {a.category}
                </span>
              </div>
              <h2 className="font-serif text-lg text-fg-primary group-hover:text-accent-sage transition-colors mb-2">
                {a.title}
              </h2>
              <p className="text-sm text-fg-tertiary line-clamp-3 leading-relaxed">
                {a.content.replace(/<[^>]+>/g, '').slice(0, 200)}
              </p>
              <p className="text-xs text-fg-disabled mt-3">
                {new Date(a.created_at).toLocaleDateString('vi-VN')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

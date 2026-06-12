import { useState, useEffect } from 'react'
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

const CATEGORIES = ['general', 'lo-au', 'tram-cam', 'stress', 'moi-quan-he', 'cham-soc-ban-than', 'tam-ly-hoc']

const CATEGORY_LABELS: Record<string, string> = {
  general: 'Tổng quát',
  'lo-au': 'Lo âu',
  'tram-cam': 'Trầm cảm',
  stress: 'Căng thẳng',
  'moi-quan-he': 'Mối quan hệ',
  'cham-soc-ban-than': 'Chăm sóc bản thân',
  'tam-ly-hoc': 'Tâm lý học',
}

export function LibraryManage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', content: '', category: 'general', status: 'draft', tags: '' })

  const fetchArticles = async () => {
    try {
      const res = await api.get('library/articles/all').json<{ success: boolean; data: Article[] }>()
      setArticles(res.data ?? [])
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const resetForm = () => setForm({ title: '', content: '', category: 'general', status: 'draft', tags: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, tags: form.tags || null }
    try {
      if (editingId) {
        await api.patch(`library/articles/${editingId}`, { json: payload })
      } else {
        await api.post('library/articles', { json: payload })
      }
      resetForm()
      setEditingId(null)
      fetchArticles()
    } catch { /* ignore */ }
  }

  const handleEdit = (a: Article) => {
    setEditingId(a.id)
    setForm({ title: a.title, content: a.content, category: a.category, status: a.status, tags: a.tags ?? '' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá bài viết này?')) return
    try {
      await api.delete(`library/articles/${id}`)
      fetchArticles()
    } catch { /* ignore */ }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-2xl text-fg-primary mb-2">Quản lý bài viết</h1>
      <p className="text-sm text-fg-tertiary mb-8">Đăng bài viết tâm lý cho thư viện cảm xúc</p>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-fg-secondary mb-1">Tiêu đề</label>
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            required
            className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-fg-secondary mb-1">Danh mục</label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-fg-secondary mb-1">Trạng thái</label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-fg-secondary mb-1">Nội dung</label>
          <textarea
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            required
            rows={8}
            className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage resize-y"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-accent-sage text-white px-6 py-2 text-sm font-medium hover:bg-accent-sage/90 transition-colors">
            {editingId ? 'Cập nhật' : 'Đăng bài'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { resetForm(); setEditingId(null) }}
              className="rounded-full border border-border px-6 py-2 text-sm text-fg-secondary hover:bg-surface-hover transition-colors">
              Hủy
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-surface-hover rounded-xl animate-pulse" />)}</div>
      ) : articles.length === 0 ? (
        <p className="text-fg-tertiary text-sm text-center py-8">Chưa có bài viết nào.</p>
      ) : (
        <div className="space-y-3">
          {articles.map(a => (
            <div key={a.id} className="rounded-2xl border border-border bg-surface p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fg-primary truncate">{a.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-accent-sage">{CATEGORY_LABELS[a.category] ?? a.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {a.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button type="button" onClick={() => handleEdit(a)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-fg-secondary hover:bg-surface-hover transition-colors">
                  Sửa
                </button>
                <button type="button" onClick={() => handleDelete(a.id)}
                  className="rounded-full border border-crisis/30 px-3 py-1 text-xs text-crisis hover:bg-crisis-surface transition-colors">
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

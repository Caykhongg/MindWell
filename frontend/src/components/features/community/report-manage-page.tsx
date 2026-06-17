import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from 'react-router-dom'
import { Flag, Check, ExternalLink } from 'lucide-react'

interface Report {
  id: number
  postId: number
  reporterId: number
  reason: string
  isResolved: boolean
  createdAt: string
}

export function ReportManagePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [filter, setFilter] = useState<'all' | 'pending'>('pending')

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await api.get('reports').json<{ success: boolean; data: Report[] }>()
      return res.data ?? []
    },
    refetchInterval: 15000,
    enabled: user?.role === 'admin',
  })

  const resolveMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`reports/${id}/resolve`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }),
  })

  if (!user || user.role !== 'admin') {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-fg-tertiary text-sm">Chỉ admin mới có quyền truy cập.</p>
      </main>
    )
  }

  const filtered = reports?.filter(r => filter === 'pending' ? !r.isResolved : true) ?? []

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="font-serif text-3xl text-fg-primary">Quản lý tố cáo</h1>
        <p className="text-fg-secondary text-sm mt-1">Xem xét các bài viết bị tố cáo vi phạm</p>
      </header>

      <div className="flex gap-2">
        <button type="button" onClick={() => setFilter('pending')}
          className={`rounded-full px-4 py-1.5 text-sm ${filter === 'pending' ? 'bg-accent-sage text-white' : 'border border-border text-fg-secondary hover:bg-surface-hover'}`}>
          Chờ xử lý ({reports?.filter(r => !r.isResolved).length ?? 0})
        </button>
        <button type="button" onClick={() => setFilter('all')}
          className={`rounded-full px-4 py-1.5 text-sm ${filter === 'all' ? 'bg-accent-sage text-white' : 'border border-border text-fg-secondary hover:bg-surface-hover'}`}>
          Tất cả ({reports?.length ?? 0})
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-surface-hover rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Flag size={40} className="mx-auto text-fg-tertiary mb-3" />
          <p className="text-fg-tertiary text-sm">Không có tố cáo nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`rounded-xl bg-surface border p-4 ${r.isResolved ? 'border-border opacity-60' : 'border-crisis/20'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fg-primary">{r.reason}</p>
                  <p className="text-xs text-fg-tertiary mt-1">
                    Bài viết #{r.postId} · {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => navigate(`/community/${r.postId}`)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-accent-sage hover:bg-accent-sage-surface flex items-center gap-1">
                    <ExternalLink size={12} /> Xem bài
                  </button>
                  {!r.isResolved && (
                    <button type="button" onClick={() => resolveMutation.mutate(r.id)}
                      disabled={resolveMutation.isPending}
                      className="rounded-full bg-accent-sage text-white px-3 py-1.5 text-xs hover:bg-accent-sage/90 disabled:opacity-50 flex items-center gap-1">
                      <Check size={12} /> Đã xử lý
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

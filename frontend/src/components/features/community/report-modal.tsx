import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Flag } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

interface ReportModalProps {
  postId: number
  open: boolean
  onClose: () => void
}

export function ReportModal({ postId, open, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const { isAuthenticated } = useAuthStore()
  const qc = useQueryClient()

  const reportMutation = useMutation({
    mutationFn: async (data: { postId: number; reason: string }) => {
      await api.post('reports', { json: data })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
      setReason('')
      setCustomReason('')
      setTimeout(onClose, 1500)
    },
  })

  if (!open || !isAuthenticated) return null

  const reasons = [
    'Spam hoặc quảng cáo',
    'Nội dung xúc phạm, thiếu tôn trọng',
    'Thông tin sai lệch',
    'Quấy rối hoặc bắt nạt',
    'Nội dung nhạy cảm không phù hợp',
    'Khác',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-canvas rounded-2xl shadow-xl border border-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4">
          <Flag size={18} className="text-crisis" />
          <h3 className="font-serif text-lg text-fg-primary">Tố cáo bài viết</h3>
        </div>

        <p className="text-sm text-fg-secondary mb-4">
          Chọn lý do tố cáo bài viết này. Admin sẽ xem xét và xử lý.
        </p>

        <div className="space-y-2 mb-4">
          {reasons.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={e => setReason(e.target.value)}
                className="accent-accent-sage"
              />
              <span className="text-sm text-fg-primary">{r}</span>
            </label>
          ))}
        </div>

        {reason === 'Khác' && (
          <textarea
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
            placeholder="Mô tả chi tiết lý do..."
            rows={3}
            className="w-full rounded-xl bg-surface border border-border px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-disabled outline-none focus:border-accent-sage resize-none mb-4"
          />
        )}

        <div className="flex gap-2">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-full border border-border px-4 py-2 text-sm text-fg-secondary hover:bg-surface-hover">
            Huỷ
          </button>
          <button type="button" onClick={() => reportMutation.mutate({ postId, reason: reason === 'Khác' ? customReason : reason })}
            disabled={!reason || (reason === 'Khác' && !customReason.trim()) || reportMutation.isPending}
            className="flex-1 rounded-full bg-crisis text-white px-4 py-2 text-sm font-medium hover:bg-crisis/90 disabled:opacity-50">
            {reportMutation.isPending ? 'Đang gửi...' : 'Gửi tố cáo'}
          </button>
        </div>

        {reportMutation.isSuccess && (
          <p className="text-xs text-accent-sage mt-3 text-center">Đã gửi tố cáo. Cảm ơn bạn!</p>
        )}
        {reportMutation.isError && (
          <p className="text-xs text-crisis mt-3 text-center">Gửi thất bại. Vui lòng thử lại.</p>
        )}
      </div>
    </div>
  )
}

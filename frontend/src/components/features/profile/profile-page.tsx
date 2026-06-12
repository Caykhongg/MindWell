import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

export function ProfilePage() {
  const { user, fetchMe, logout } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await api.put('auth/me', { json: { name, phone: phone || null, avatarUrl: avatarUrl || null } })
      await fetchMe()
      setMessage('Cập nhật thành công')
    } catch {
      setError('Không thể cập nhật thông tin')
    }
    setSaving(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp')
      return
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    setChangingPw(true)
    setMessage(null)
    setError(null)
    try {
      await api.put('auth/password', { json: { currentPassword, newPassword } })
      setMessage('Đổi mật khẩu thành công')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Mật khẩu hiện tại không đúng')
    }
    setChangingPw(false)
  }

  if (!user) return null

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="font-serif text-2xl text-fg-primary">Cài đặt tài khoản</h1>
        <p className="text-sm text-fg-tertiary mt-1">Quản lý thông tin cá nhân và bảo mật</p>
      </header>

      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-crisis-surface border border-crisis/20 px-5 py-3 text-sm text-crisis">
          {error}
        </div>
      )}

      {/* Profile Info */}
      <section>
        <h2 className="font-serif text-lg text-fg-primary mb-4">Thông tin cá nhân</h2>
        <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          {/* Avatar preview */}
          {avatarUrl && (
            <div className="flex justify-center">
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-accent-sage/30" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-fg-secondary mb-1">Tên hiển thị</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg-secondary mb-1">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full rounded-xl bg-surface-hover border border-border px-4 py-2.5 text-sm text-fg-disabled cursor-not-allowed"
            />
            <p className="text-xs text-fg-tertiary mt-1">Email không thể thay đổi</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-fg-secondary mb-1">Số điện thoại</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="090..."
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg-secondary mb-1">URL ảnh đại diện</label>
            <input
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-fg-tertiary">
            <span>Vai trò: <strong className="text-fg-secondary capitalize">{user.role === 'admin' ? 'Quản trị viên' : user.role === 'therapist' ? 'Tư vấn viên' : 'Bệnh nhân'}</strong></span>
            <span aria-hidden>·</span>
            <span>Tham gia: <strong className="text-fg-secondary">{user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}</strong></span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent-sage text-white px-6 py-2 text-sm font-medium hover:bg-accent-sage/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section>
        <h2 className="font-serif text-lg text-fg-primary mb-4">Đổi mật khẩu</h2>
        <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg-secondary mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg-secondary mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg-secondary mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl bg-canvas border border-border px-4 py-2.5 text-sm text-fg-primary focus:outline-none focus:ring-2 focus:ring-accent-sage"
            />
          </div>
          <button
            type="submit"
            disabled={changingPw}
            className="rounded-full bg-accent-sage text-white px-6 py-2 text-sm font-medium hover:bg-accent-sage/90 transition-colors disabled:opacity-50"
          >
            {changingPw ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </section>

      {/* Account Actions */}
      <section>
        <h2 className="font-serif text-lg text-fg-primary mb-4">Tài khoản</h2>
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl border border-crisis/30 px-4 py-2.5 text-sm text-crisis font-medium hover:bg-crisis-surface transition-colors text-left"
          >
            Đăng xuất
          </button>
        </div>
      </section>
    </main>
  )
}

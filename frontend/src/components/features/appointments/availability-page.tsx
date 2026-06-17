import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { Check, X, Plus, Clock } from 'lucide-react'

const DAYS_OF_WEEK = ['Thu Hai', 'Thu Ba', 'Thu Tu', 'Thu Nam', 'Thu Sau', 'Thu Bay', 'Chu Nhat']

interface Slot {
  dayOfWeek: string
  startTime: string
  endTime: string
}

export function AvailabilityPage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [slots, setSlots] = useState<Slot[]>([])
  const [editing, setEditing] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: async () => {
      const res = await api.get('availability').json<{ success: boolean; data: { availability: any[]; timeOff: any[] } }>()
      return res.data
    },
  })

  useEffect(() => {
    if (data?.availability) {
      setSlots(data.availability.map((a: any) => ({
        dayOfWeek: a.day_of_week,
        startTime: a.start_time.slice(0, 5),
        endTime: a.end_time.slice(0, 5),
      })))
    }
  }, [data])

  const saveMutation = useMutation({
    mutationFn: async (slotsData: Slot[]) => {
      await api.put('availability', { json: { slots: slotsData } })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['availability'] })
      setEditing(false)
    },
  })

  const addSlot = (day: string) => {
    setSlots(prev => [...prev, { dayOfWeek: day, startTime: '08:00', endTime: '09:00' }])
  }

  const updateSlot = (index: number, field: keyof Slot, value: string) => {
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const removeSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index))
  }

  const groupedSlots = DAYS_OF_WEEK.map(day => ({
    day,
    slots: slots.filter(s => s.dayOfWeek === day),
  }))

  if (!user || (user.role !== 'therapist' && user.role !== 'admin')) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-fg-tertiary text-sm">Chỉ tư vấn viên mới có thể quản lý lịch rảnh.</p>
      </main>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-fg-primary">Lịch rảnh</h1>
          <p className="text-fg-secondary text-sm mt-1">Thiết lập khung giờ bạn có thể nhận tư vấn</p>
        </div>
        <button
          type="button"
          onClick={() => editing ? setSlots(data?.availability?.map((a: any) => ({
            dayOfWeek: a.day_of_week,
            startTime: a.start_time.slice(0, 5),
            endTime: a.end_time.slice(0, 5),
          })) ?? []) || setEditing(false) : setEditing(true)}
          className="rounded-full border border-border px-4 py-2 text-sm text-fg-secondary hover:bg-surface-hover"
        >
          {editing ? 'Huỷ' : 'Sửa'}
        </button>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-surface-hover rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {groupedSlots.map(({ day, slots: daySlots }) => (
            <div key={day} className="rounded-xl bg-surface border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-fg-primary">{day}</span>
                {editing && (
                  <button
                    type="button"
                    onClick={() => addSlot(day)}
                    className="rounded-full bg-accent-sage text-white p-1 hover:bg-accent-sage/90"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>
              {daySlots.length === 0 && !editing && (
                <p className="text-xs text-fg-tertiary">Không có lịch</p>
              )}
              <div className="space-y-2">
                {daySlots.map((slot, idx) => {
                  const globalIdx = slots.indexOf(slot)
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-accent-sage shrink-0" />
                      {editing ? (
                        <>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={e => updateSlot(globalIdx, 'startTime', e.target.value)}
                            className="rounded-lg bg-surface border border-border px-2 py-1 text-fg-primary text-sm w-24"
                          />
                          <span className="text-fg-tertiary">→</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={e => updateSlot(globalIdx, 'endTime', e.target.value)}
                            className="rounded-lg bg-surface border border-border px-2 py-1 text-fg-primary text-sm w-24"
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(globalIdx)}
                            className="text-crisis hover:bg-crisis-surface rounded-lg p-1"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <span className="text-fg-secondary">
                          {slot.startTime} → {slot.endTime}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <button
          type="button"
          onClick={() => saveMutation.mutate(slots)}
          disabled={saveMutation.isPending}
          className="w-full rounded-full bg-accent-sage text-white font-medium py-2.5 px-6 hover:bg-accent-sage/90 disabled:opacity-50"
        >
          {saveMutation.isPending ? 'Đang lưu...' : 'Lưu lịch rảnh'}
        </button>
      )}
    </div>
  )
}

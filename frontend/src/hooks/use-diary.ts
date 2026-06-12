import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DiaryEntry } from '@/types'
import type { CreateEntryFormData } from '@/lib/diary-schemas'

function toEntry(e: any): DiaryEntry {
  return {
    id: e.id,
    user_id: e.userId ?? e.user_id,
    content: e.content,
    mood: e.mood,
    tags: Array.isArray(e.tags) ? e.tags : (typeof e.tags === 'string' ? e.tags.split(',').filter(Boolean) : []),
    created_at: e.createdAt ?? e.created_at,
    updated_at: e.updatedAt ?? e.updated_at,
  }
}

export function useDiaryEntries() {
  return useQuery({
    queryKey: ['diary'],
    queryFn: async () => {
      const res = await api.get('diary').json<{ success: boolean; data: any[] }>()
      return { entries: (res.data ?? []).map(toEntry) }
    },
    staleTime: 0,
    gcTime: 0,
  })
}

export function useCreateDiaryEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEntryFormData) =>
      api.post('diary', { json: data }).json<{ success: boolean; data: any }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  })
}

export function useDeleteDiaryEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`diary/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  })
}

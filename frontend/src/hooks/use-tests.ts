import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { TestResult } from '@/types'

export function useTestHistory() {
  return useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const res = await api.get('tests').json<{ success: boolean; data: any[] }>()
      return { tests: (res.data ?? []).map(toTestResult) }
    },
    staleTime: 0,
    gcTime: 0,
    retry: false,
  })
}

export function useSaveTest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { test_type: string; score: number; severity: string; result: string; answers: number[] }) =>
      api.post('tests', { json: data }).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tests'] }),
  })
}

function toTestResult(e: any): TestResult {
  return {
    id: e.id,
    user_id: e.userId ?? e.user_id,
    test_type: e.testType ?? e.test_type,
    score: e.score,
    severity: e.severity,
    result: e.result,
    answers: e.answers ?? [],
    created_at: e.createdAt ?? e.created_at,
  }
}

export interface TestTemplate {
  id: number
  title: string
  description: string
  createdBy: number
  questions: { id?: number; questionText: string; options: { label: string; value: number }[]; orderIndex: number }[]
  createdAt: string
}

export function useTestTemplates() {
  return useQuery({
    queryKey: ['test-templates'],
    queryFn: async () => {
      const res = await api.get('test-templates').json<{ success: boolean; data: any[] }>()
      return (res.data ?? []).map(toTemplate)
    },
    staleTime: 30_000,
  })
}

function toTemplate(e: any): TestTemplate {
  return {
    id: e.id,
    title: e.title ?? e.name,
    description: e.description ?? '',
    createdBy: e.createdBy ?? e.created_by ?? 0,
    questions: (e.questions ?? []).map((q: any) => ({
      id: q.id,
      questionText: q.questionText ?? q.question_text ?? '',
      options: (q.options ?? []).map((o: any) => ({ label: o.label, value: o.value })),
      orderIndex: q.orderIndex ?? q.order_index ?? 0,
    })),
    createdAt: e.createdAt ?? e.created_at ?? '',
  }
}

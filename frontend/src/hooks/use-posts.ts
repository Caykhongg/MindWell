import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Post, Comment, User } from '@/types'
import type { CreatePostFormData, CreateCommentFormData } from '@/lib/post-schemas'

interface RawPost {
  id: number
  userId?: number
  user_id?: number
  title: string
  content: string
  isAnonymous?: boolean
  is_anonymous?: boolean
  likeCount?: number
  like_count?: number
  commentCount?: number
  comment_count?: number
  createdAt?: string
  created_at?: string
  author?: User
  guestName?: string
  guest_name?: string
  guestEmail?: string
  guest_email?: string
}

interface RawComment {
  id: number
  postId?: number
  post_id?: number
  userId?: number
  user_id?: number
  content: string
  isAnonymous?: boolean
  is_anonymous?: boolean
  createdAt?: string
  created_at?: string
  author?: User
  guestName?: string
  guest_name?: string
  guestEmail?: string
  guest_email?: string
}

function toPost(m: RawPost): Post {
  return {
    id: m.id,
    user_id: m.userId ?? m.user_id ?? null,
    title: m.title,
    content: m.content,
    is_anonymous: !!(m.isAnonymous ?? m.is_anonymous),
    like_count: m.likeCount ?? m.like_count ?? 0,
    comment_count: m.commentCount ?? m.comment_count ?? 0,
    created_at: m.createdAt ?? m.created_at!,
    author: m.author,
    guest_name: m.guestName ?? m.guest_name,
    guest_email: m.guestEmail ?? m.guest_email,
  }
}

function toComment(m: RawComment): Comment {
  return {
    id: m.id,
    post_id: m.postId ?? m.post_id!,
    user_id: m.userId ?? m.user_id ?? null,
    content: m.content,
    is_anonymous: !!(m.isAnonymous ?? m.is_anonymous),
    created_at: m.createdAt ?? m.created_at!,
    author: m.author,
    guest_name: m.guestName ?? m.guest_name,
    guest_email: m.guestEmail ?? m.guest_email,
  }
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('posts').json<{ success: boolean; data: RawPost[] }>()
      return { posts: (res.data ?? []).map(toPost) }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get(`posts/${id}`).json<{ success: boolean; data: RawPost }>()
      return toPost(res.data)
    },
  })
}

export function usePostComments(postId: number) {
  return useQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: async () => {
      const res = await api.get(`posts/${postId}/comments`).json<{ success: boolean; data: RawComment[] }>()
      return { comments: (res.data ?? []).map(toComment) }
    },
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreatePostFormData) => {
      const res = await api.post('posts', { json: data }).json<{ success: boolean; data: RawPost }>()
      return toPost(res.data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`posts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePostFormData> }) => {
      const res = await api.put(`posts/${id}`, { json: data }).json<{ success: boolean; data: RawPost }>()
      return toPost(res.data)
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['post', variables.id] })
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useCreateComment(postId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateCommentFormData) => {
      const res = await api.post(`posts/${postId}/comments`, { json: data }).json<{ success: boolean; data: Comment }>()
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', postId] })
      qc.invalidateQueries({ queryKey: ['post', postId, 'comments'] })
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdateComment(postId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ commentId, data }: { commentId: number; data: { content: string; isAnonymous?: boolean } }) => {
      const res = await api.put(`posts/${postId}/comments/${commentId}`, { json: data }).json<{ success: boolean; data: Comment }>()
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', postId, 'comments'] })
    },
  })
}

export function useDeleteComment(postId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (commentId: number) => {
      await api.delete(`posts/${postId}/comments/${commentId}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', postId] })
      qc.invalidateQueries({ queryKey: ['post', postId, 'comments'] })
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useLikePost(postId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post(`posts/${postId}/like`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', postId] })
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAgentStore } from '@/stores/agent-store'
import { AgentMessage, TypingDots } from './agent-message'
import { AgentQuickActions } from './agent-quick-actions'
import { QUICK_ACTIONS, PREDEFINED_REPLIES, getBotReply } from './agent-data'
import type { QuickAction, AgentMessage as AgentMessageType } from '@/types'
import { GripHorizontal } from 'lucide-react'

let msgIdCounter = 0
function nextId() {
  msgIdCounter += 1
  return `msg_${Date.now()}_${msgIdCounter}`
}

export function AgentPanel() {
  const { messages, isLoading, addMessage, setLoading, closePanel } = useAgentStore()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, origLeft: 0, origTop: 0 })
  const [pos, setPos] = useState(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth - 360 - 24 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight - 600 - 96 : 0,
  }))

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const d = dragRef.current
      if (!d.isDragging) return
      const dx = e.clientX - d.startX
      const dy = e.clientY - d.startY
      setPos({ x: d.origLeft + dx, y: d.origTop + dy })
    }
    const handleMouseUp = () => {
      dragRef.current.isDragging = false
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const addBotReply = useCallback((text: string) => {
    const msg: AgentMessageType = {
      id: nextId(),
      role: 'bot',
      text,
      timestamp: Date.now(),
    }
    addMessage(msg)
  }, [addMessage])

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: AgentMessageType = {
      id: nextId(),
      role: 'user',
      text: trimmed,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setInput('')
    setLoading(true)

    const keywordReply = getBotReply(trimmed)
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 600))
    addBotReply(keywordReply)
    setLoading(false)
  }, [addMessage, setLoading, addBotReply])

  const handleQuickAction = useCallback((action: QuickAction) => {
    const reply = PREDEFINED_REPLIES[action.id]
    if (!reply) return

    const userMsg: AgentMessageType = {
      id: nextId(),
      role: 'user',
      text: action.label,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setLoading(true)

    setTimeout(() => {
      addBotReply(reply)
      setLoading(false)
    }, 700)
  }, [addMessage, setLoading, addBotReply])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }, [handleSend, input])

  const hasMessages = messages.length > 0
  const showWelcome = !hasMessages && !isLoading

  return (
    <div
      ref={panelRef}
      className="fixed z-40 w-[360px] max-w-[calc(100vw-48px)] rounded-xl bg-canvas border border-border shadow-xl flex flex-col animate-slide-up"
      style={{
        maxHeight: 'min(600px, calc(100vh - 120px))',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
      role="dialog"
      aria-label="Trợ lý MindWell"
    >
      <div
        onMouseDown={handleDragStart}
        className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2">
          <GripHorizontal size={14} className="text-fg-tertiary" />
          <span className="text-lg">🌿</span>
          <span className="text-sm font-medium text-fg-primary">Trợ lý MindWell</span>
        </div>
        <button
          type="button"
          onClick={closePanel}
          aria-label="Đóng"
          className="rounded-full p-1.5 text-fg-tertiary hover:text-fg-primary hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto py-3 space-y-1">
        {showWelcome && (
          <div className="px-4 py-2">
            <div className="bg-accent-sage-surface rounded-xl rounded-bl-sm px-3.5 py-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {PREDEFINED_REPLIES.welcome}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <AgentMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingDots />}
      </div>

      {showWelcome && (
        <AgentQuickActions
          actions={QUICK_ACTIONS}
          onSelect={handleQuickAction}
        />
      )}

      <div className="border-t border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi..."
            rows={1}
            aria-label="Câu hỏi của bạn"
            className="flex-1 resize-none rounded-xl bg-surface px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-disabled outline-none border border-border focus:border-accent-sage transition-colors min-h-[44px] max-h-[120px] leading-relaxed"
          />
          <button
            type="button"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            aria-label="Gửi"
            className="flex-shrink-0 rounded-full bg-accent-sage text-white p-3 transition-colors hover:bg-accent-sage/90 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sage focus-visible:ring-offset-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

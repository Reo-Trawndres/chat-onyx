

## NoirAI Professional Upgrade Plan

### Overview
Add chat history sidebar, copy-to-clipboard on AI messages, stop-generation button, and enhanced markdown rendering — all matching the existing Noir aesthetic.

### Architecture

```text
┌─────────────────────────────────────────┐
│ SidebarProvider (wraps full layout)     │
│ ┌──────────┐ ┌────────────────────────┐ │
│ │ ChatSidebar │ │ Main Chat Area       │ │
│ │ - New Chat  │ │ - ChatHeader         │ │
│ │ - Session 1 │ │ - ChatMessages       │ │
│ │ - Session 2 │ │ - ChatInput          │ │
│ │ - ...       │ │                      │ │
│ └──────────┘ └────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Changes by Feature

**1. Chat History (localStorage + Sidebar)**
- Create `src/hooks/useChatHistory.ts` — manages an array of `{ id, title, messages, updatedAt }` sessions in localStorage. Provides `createChat`, `deleteChat`, `switchChat`, `updateChat`.
- Refactor `useChat.ts` to accept/return a session ID and delegate persistence to `useChatHistory`.
- Create `src/components/ChatSidebar.tsx` — uses shadcn Sidebar with collapsible="offcanvas" on mobile, "icon" on desktop. Lists past chats sorted by recency. "New Chat" button at top. Active chat highlighted. Delete button per chat.
- Wrap layout in `SidebarProvider` in `Index.tsx`. Add `SidebarTrigger` to `ChatHeader`.

**2. Enhanced Markdown**
- Already using `react-markdown`. Add `remark-gfm` plugin for tables/strikethrough. Refine prose styles in `ChatMessages.tsx` to ensure bold, italics, lists, and code blocks render cleanly with the Noir palette.

**3. Copy Button on AI Messages**
- In `ChatMessages.tsx`, add a small `Copy` icon (lucide `Copy`/`Check`) below each assistant message bubble. On click, copy `msg.content` to clipboard and briefly show a check icon. Styled as subtle muted-foreground, visible on hover or always on mobile.

**4. Stop Button**
- Expose `stopStreaming` from `useChat` (calls `abortRef.current?.abort()`).
- In `ChatInput.tsx`, when `isStreaming` is true, replace the Send button with a Stop button (square icon, destructive-ish styling). On click, call `stopStreaming`.

**5. Aesthetic Consistency**
- Sidebar uses `bg-sidebar-background`, `text-sidebar-foreground`, gold accent for active state — all tokens already defined in `index.css`.
- All new buttons use `ghost` variant with `text-muted-foreground hover:text-foreground`.
- Chat session titles auto-generated from first user message (truncated).

### Files to Create/Edit
| File | Action |
|---|---|
| `src/hooks/useChatHistory.ts` | Create — session CRUD + localStorage |
| `src/hooks/useChat.ts` | Edit — add stopStreaming, integrate with history |
| `src/components/ChatSidebar.tsx` | Create — sidebar with chat list |
| `src/components/ChatMessages.tsx` | Edit — copy button, remark-gfm, prose fixes |
| `src/components/ChatInput.tsx` | Edit — stop button when streaming |
| `src/components/ChatHeader.tsx` | Edit — add SidebarTrigger |
| `src/pages/Index.tsx` | Edit — wrap in SidebarProvider, wire history |
| `package.json` | Add `remark-gfm` dependency |


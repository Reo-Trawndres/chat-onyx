
## AI Chat Interface — Dark Luxury Design

### Pages & Layout
- Single-page chat app with a full-screen dark UI (near-black background, subtle accent colors, clean sans-serif typography)
- Responsive: works seamlessly on mobile and desktop

### Features

1. **Settings Panel** — Slide-out drawer/modal with an input for "API Endpoint URL", saved to localStorage, default: `http://34.159.40.229:11434/api/chat`

2. **Chat Window** — Message list with distinct user/AI bubble styling, auto-scroll, markdown rendering for AI responses

3. **Streaming Responses** — Fetch API with `ReadableStream` reader, tokens appear word-by-word in real-time

4. **Payload Format** — Sends `{"model": "llama3.2:3b", "messages": [...], "stream": true}` with full conversation history

5. **Storyteller Mode** — Toggle switch in header/settings. When ON, prepends a system message for creative writing mode. Visual indicator when active

### UI Components
- Header bar: app title, Storyteller toggle, settings gear icon
- Message input bar fixed at bottom with send button
- Settings drawer using shadcn Sheet component
- Messages rendered with `react-markdown`

### Design Tokens
- Background: very dark gray/charcoal
- Text: off-white/cream
- Accent: gold or warm amber for highlights
- Subtle borders, generous spacing, refined feel



## Add Configurable AI Model Name

### What Changes

**3 files edited:**

1. **`src/hooks/useChat.ts`** — Add `MODEL_STORAGE_KEY` and default `'llama3'`. Expose `model` and `setModel` (reads/writes localStorage). Use the stored model value in the fetch payload instead of hardcoded `'llama3.2:3b'`.

2. **`src/components/SettingsSheet.tsx`** — Add `model`/`onModelChange` props. Add a second input field labeled "AI Model Name" with placeholder `"llama3"`. Local state syncs like the endpoint field. Both saved on "Save" click.

3. **`src/pages/Index.tsx`** — Pass `model` and `setModel` from `useChat` through to `SettingsSheet` as `model`/`onModelChange`.

### Technical Details

- Storage key: `ai-chat-model`, default: `llama3`
- In `sendMessage`, line 69 changes from `model: 'llama3.2:3b'` to `model: getModel()`
- Same getter/setter pattern already used for the endpoint


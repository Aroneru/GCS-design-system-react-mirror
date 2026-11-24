// No test dependency: uses Node WebSocket and Chrome DevTools Protocol.
// Start Vite on 5173 and an isolated Chrome with --remote-debugging-port=9223.
import assert from 'node:assert/strict'

let tabs
try {
  tabs = await fetch('http://127.0.0.1:9223/json').then((response) => {
    if (!response.ok) throw new Error(`Chrome returned ${response.status}`)
    return response.json()
  })
} catch (error) {
  throw new Error(`Clipboard runtime requires Chrome DevTools on port 9223: ${String(error)}`)
}

const tab = tabs.find((candidate) => candidate.type === 'page')
if (!tab?.webSocketDebuggerUrl) {
  throw new Error('Clipboard runtime requires at least one Chrome page target on port 9223.')
}

const socket = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))

let id = 0
const requests = new Map()
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  const pending = requests.get(message.id)
  if (!pending) return
  requests.delete(message.id)
  message.error ? pending.reject(message.error) : pending.resolve(message.result)
})

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    requests.set(++id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
  return result.result.value
}

const wait = (duration = 80) => new Promise((resolve) => setTimeout(resolve, duration))

try {
  await send('Page.enable')
  await send('Page.navigate', { url: `http://127.0.0.1:5173/?clipboard-runtime=${Date.now()}#/components/clipboard` })
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate("document.querySelector('h1')?.textContent === 'Clipboard'")) break
    await wait(100)
  }
  assert(await evaluate("document.querySelector('h1')?.textContent === 'Clipboard'"), 'Vite Clipboard route did not load.')

  const docs = await evaluate(`(() => {
    const snippets = [...document.querySelectorAll('pre code')]
      .map((code) => code.textContent ?? '')
      .filter((code) => code.includes('<Clipboard'))
    const clipboardTags = snippets.flatMap((snippet) => snippet
      .split('<Clipboard')
      .slice(1)
      .map((part) => '<Clipboard' + part.split('/>')[0] + '/>'))
    const hasAccessibleName = (tag) =>
      tag.includes(' label=') || tag.includes(' aria-label=') || tag.includes(' aria-labelledby=')

    return {
      count: clipboardTags.length,
      everySnippetNamed: clipboardTags.every(hasAccessibleName),
      darkSnippetNamed: [...document.querySelectorAll('#dark-mode pre code')]
        .some((code) => code.textContent?.includes('aria-label="Alamat situs"')),
    }
  })()`)
  assert(docs.count > 0, 'Clipboard docs should contain code snippets.')
  assert(docs.everySnippetNamed, 'Every Clipboard code snippet must include label, aria-label, or aria-labelledby.')
  assert(docs.darkSnippetNamed, 'Dark mode snippet must demonstrate aria-label="Alamat situs".')

  await evaluate(`(() => {
    const group = [...document.querySelectorAll('#playground [role="group"]')]
      .find((element) => element.getAttribute('aria-label') === 'Tampilkan label')
    const withoutLabel = [...(group?.querySelectorAll('button') ?? [])]
      .find((button) => button.textContent === 'Tidak ada')
    if (!withoutLabel) throw new Error('Playground label control is unavailable.')
    withoutLabel.click()
  })()`)
  await wait()
  const unnamedLabelUsage = await evaluate(`(() => {
    const preview = document.querySelector('#playground input[readonly]')
    const usage = document.querySelector('#penggunaan pre code')?.textContent ?? ''
    return preview?.getAttribute('aria-label') === 'Nomor referensi'
      && usage.includes('aria-label="Nomor referensi"')
      && !usage.includes('    label=')
  })()`)
  assert(unnamedLabelUsage, 'Playground without a visual label must generate an aria-label snippet.')

  const results = await evaluate(`(async () => {
    // Reuse the exact Vite dependency URLs already used by the app. Importing
    // the same file without its ?v= query creates another React module and
    // triggers Invalid hook call when Clipboard is rendered.
    const resources = performance.getEntriesByType('resource').map((entry) => entry.name)
    const reactUrl = resources.find((url) => url.includes('/node_modules/.vite/deps/react.js?v='))
    const reactDomUrl = resources.find((url) => url.includes('/node_modules/.vite/deps/react-dom_client.js?v='))
    if (!reactUrl || !reactDomUrl) throw new Error('Vite React dependency URLs are unavailable; load the app route before mounting Clipboard.')
    const reactModule = await import(reactUrl)
    const React = reactModule.default ?? reactModule
    const reactDomModule = await import(reactDomUrl)
    const createRoot = reactDomModule.createRoot ?? reactDomModule.default.createRoot
    const { Clipboard } = await import('/src/lib/components/Clipboard.tsx?runtime=' + Date.now())
    const host = document.createElement('div')
    host.id = 'clipboard-runtime-host'
    document.body.append(host)
    const root = createRoot(host)
    let rootUnmounted = false
    const delay = (duration = 70) => new Promise((resolve) => setTimeout(resolve, duration))
    const render = async (props, theme) => {
      const element = React.createElement(Clipboard, props)
      root.render(theme ? React.createElement('div', { 'data-theme': theme }, element) : element)
      await delay()
    }
    const input = () => host.querySelector('input')
    const action = () => host.querySelector('button[type="button"]')
    const status = () => host.querySelector('[role="status"]')?.textContent
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
    const setClipboard = (value) => Object.defineProperty(navigator, 'clipboard', { configurable: true, value })
    const restoreClipboard = () => {
      if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor)
      else delete navigator.clipboard
    }
    const output = {}

    try {
      const inputRef = React.createRef()
      await render({ value: 'INV-1', label: 'Nomor referensi', ref: inputRef })
      output.default = input().readOnly && action().textContent === 'Copy' && input().labels[0]?.textContent === 'Nomor referensi' && inputRef.current === input()

      await render({ value: 'URL', variant: 'segmented', prefix: 0, 'aria-label': 'Alamat' })
      output.segmentedAndZeroPrefix = host.textContent.includes('0') && action().getAttribute('aria-label') === 'Copy to clipboard'
      await render({ value: 'URL', variant: 'segmented', prefix: '   ', 'aria-label': 'Alamat' })
      output.emptyPrefixHidden = !host.textContent.includes('   ')

      await render({ value: 'zero', label: 0, helperText: 0 })
      output.zeroLabelAndHelper = input().labels[0]?.textContent === '0' && host.textContent.includes('0') && input().getAttribute('aria-describedby')?.includes('-helper')
      await render({ value: 'default-prefix', label: 'Label', prefix: 'Tidak dirender' })
      output.defaultIgnoresPrefix = !host.textContent.includes('Tidak dirender')

      await render({ value: 'ID', label: 'Label', helperText: 'Bantuan', 'aria-describedby': 'consumer-help' })
      output.descriptionsMerged = input().getAttribute('aria-describedby')?.includes('consumer-help') && input().getAttribute('aria-describedby')?.includes('-helper')
      await render({ value: 'ID', 'aria-labelledby': 'external-name' })
      output.ariaLabelledBy = input().getAttribute('aria-labelledby') === 'external-name'
      await render({ value: 'ID', 'aria-label': 'Nama field' })
      output.ariaLabel = input().getAttribute('aria-label') === 'Nama field'

      const copied = []
      setClipboard({ writeText: async (value) => copied.push(value) })
      await render({ value: 'exact value', variant: 'segmented', 'aria-label': 'Salin', onCopySuccess: (value) => copied.push('callback:' + value) })
      action().click()
      await delay()
      output.success = copied.join('|') === 'exact value|callback:exact value' && status() === 'Copied to clipboard.' && action().querySelector('svg')?.classList.contains('size-5')
      await delay(1650)
      output.feedbackTimeout = status() === ''

      setClipboard({ writeText: async () => { throw new Error('denied') } })
      await render({ value: 'fail', 'aria-label': 'Salin' })
      action().click()
      await delay()
      output.rejected = status() === 'Could not copy. Select the text and copy it manually.'
      delete navigator.clipboard
      await render({ value: 'missing', 'aria-label': 'Salin' })
      action().click()
      await delay()
      output.unavailable = status() === 'Could not copy. Select the text and copy it manually.'

      let resolvePending
      let writes = 0
      setClipboard({ writeText: () => { writes++; return new Promise((resolve) => { resolvePending = resolve }) } })
      const staleCallbacks = []
      await render({ value: 'old', 'aria-label': 'Salin', onCopySuccess: (value) => staleCallbacks.push(value) })
      action().click()
      action().click()
      await render({ value: 'new', 'aria-label': 'Salin', onCopySuccess: (value) => staleCallbacks.push(value) })
      action().click()
      resolvePending()
      await delay()
      output.pendingValueChange = writes === 1 && status() === '' && staleCallbacks.length === 0

      let resolveDisabled
      setClipboard({ writeText: () => new Promise((resolve) => { resolveDisabled = resolve }) })
      const disabledCallbacks = []
      await render({ value: 'pending', 'aria-label': 'Salin', onCopySuccess: () => disabledCallbacks.push('success') })
      action().click()
      await render({ value: 'pending', 'aria-label': 'Salin', disabled: true, onCopySuccess: () => disabledCallbacks.push('success') })
      resolveDisabled()
      await delay()
      output.disabledPending = input().disabled && action().disabled && status() === '' && disabledCallbacks.length === 0

      const unhandled = []
      const onUnhandled = (event) => { unhandled.push(event.reason); event.preventDefault() }
      window.addEventListener('unhandledrejection', onUnhandled)
      const callbackCalls = []
      setClipboard({ writeText: async () => undefined })
      await render({ value: 'callback-success', 'aria-label': 'Salin', onCopySuccess: (value) => { callbackCalls.push(value); throw new Error('consumer success') } })
      action().click()
      await delay()
      const successStable = status() === 'Copied to clipboard.' && callbackCalls[0] === 'callback-success'
      setClipboard({ writeText: async () => { throw new Error('clipboard fail') } })
      await render({ value: 'callback-error', 'aria-label': 'Salin', onCopyError: async (error) => { callbackCalls.push(error.message); throw new Error('consumer error') } })
      action().click()
      await delay()
      window.removeEventListener('unhandledrejection', onUnhandled)
      output.callbacksIsolated = successStable && status() === 'Could not copy. Select the text and copy it manually.' && callbackCalls.includes('clipboard fail') && unhandled.length === 0

      await render({ value: 'platform', label: 'Platform', platform: 'default' })
      const defaultPlatform = input().classList.contains('text-sm') && input().classList.contains('h-10.5')
      await render({ value: 'platform', label: 'Platform', platform: 'mobile' })
      output.platforms = defaultPlatform && input().classList.contains('text-xs') && input().classList.contains('h-9.75')

      await render({ value: 'theme', label: 'Tema' }, 'dark')
      const dark = getComputedStyle(input()).backgroundColor === 'rgb(31, 42, 55)'
      root.render(React.createElement('div', { 'data-theme': 'dark' }, React.createElement('div', { 'data-theme': 'light' }, React.createElement(Clipboard, { value: 'theme', label: 'Tema' }))))
      await delay()
      output.ambientTheme = dark && getComputedStyle(input()).backgroundColor === 'rgb(249, 250, 251)'

      await render({ value: 'timer', 'aria-label': 'Timer' })
      setClipboard({ writeText: async () => undefined })
      action().click()
      await delay()
      const originalConsoleError = console.error
      const unmountErrors = []
      console.error = (...args) => unmountErrors.push(args)
      root.unmount()
      rootUnmounted = true
      await delay(1650)
      console.error = originalConsoleError
      output.unmountCleanup = unmountErrors.length === 0
    } finally {
      restoreClipboard()
      if (!rootUnmounted) root.unmount()
      host.remove()
    }

    return output
  })()`)

  for (const [name, passed] of Object.entries(results)) assert.equal(passed, true, name)
  console.log(`Clipboard runtime checks passed: ${Object.keys(results).join(', ')}`)
} finally {
  socket.close()
}

// No test dependency: uses Node's WebSocket and Chrome DevTools Protocol.
// Start Vite and isolated headless Chrome on port 9223 before running.
import assert from 'node:assert/strict'
const tabs = await fetch('http://127.0.0.1:9223/json').then((response) => response.json())
const socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
let id = 0
const requests = new Map()
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  const pending = requests.get(message.id)
  if (pending) {
    requests.delete(message.id)
    if (message.error) pending.reject(message.error)
    else pending.resolve(message.result)
  }
})
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    requests.set(++id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression, userGesture = false) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture })
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
  return result.result.value
}
const wait = () => new Promise(resolve => setTimeout(resolve, 100))
const check = async (expression, label) => assert(await evaluate(expression), label)
const click = async selector => { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await wait() }
const dialog = "document.querySelector('#playground dialog')"
const open = async () => {
  await click('#playground button[aria-haspopup="dialog"]')
  await check(`${dialog}.open`, 'opens / reopens')
}
const closed = async expected => {
  await wait()
  await check(`${dialog}.open === ${!expected}`, 'expected native open state')
  await check(`document.querySelector('#playground button[aria-haspopup="dialog"]').getAttribute('aria-expanded') === '${!expected}'`, 'React state synchronized')
}
try {
  await send('Page.enable')
  await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/#/components/modal' })
  for (let i = 0; i < 100; i++) {
    if (await evaluate("!!document.querySelector('#playground input')")) break
    await wait()
  }
  for (const variant of ['Default', 'Popup']) {
    await evaluate(`[...document.querySelectorAll('#playground button')].find(b => b.textContent === '${variant}').click()`)
    await wait()
    for (let mask = 0; mask < 8; mask++) {
      const values = [!!(mask & 4), !!(mask & 2), !!(mask & 1)]
      for (let index = 0; index < 3; index++) {
        await evaluate(`(() => { const input = document.querySelectorAll('#playground input[type=checkbox]')[${index}]; if (input.checked !== ${values[index]}) input.click() })()`)
        await wait()
      }
      const code = await evaluate("document.querySelector('#penggunaan pre code').textContent")
      for (const [index, prop] of ['closeOnBackdrop', 'closeOnEscape', 'showCloseButton'].entries()) {
        assert.equal(code.includes(`${prop}={false}`), !values[index], `${prop} snippet`)
        assert(!code.includes(`${prop}={true}`), 'omit true')
      }
      await open()
      await check(`${dialog}.querySelectorAll('button[aria-label="Tutup modal"]').length === ${values[2] ? 1 : 0}`, 'X presence')
      await evaluate(`${dialog}.querySelector('p').dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 0, clientY: 0 }))`)
      await closed(false)
      await evaluate(`(() => { const d = ${dialog}; const r = d.getBoundingClientRect(); d.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 })) })()`)
      await closed(false)
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1 })
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1 })
      await closed(values[0])
      if (values[0]) await open()
      await evaluate(`(() => { const d = ${dialog}; window.cancelPrevented = false; d.addEventListener('cancel', e => { queueMicrotask(() => { window.cancelPrevented = e.defaultPrevented }) }, { once: true }) })()`)
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await closed(values[1])
      await check('window.cancelPrevented', 'native cancel prevented')
      if (values[1]) await open()
      if (values[2]) {
        await click('#playground dialog button[aria-label="Tutup modal"]')
        await closed(true)
        await open()
      }
      await click('#playground dialog > div:last-child button')
      await closed(true)
      await open()
      await evaluate(`${dialog}.close()`)
      await closed(true)
      console.log(`${variant} ${values.join('/')} : backdrop, Escape, X, footer, native close, children, snippets passed`)
    }
  }
  await check(`['closeOnBackdrop','closeOnEscape','showCloseButton'].every(prop => [...document.querySelectorAll('#properties tbody tr')].some(row => row.cells[0].textContent === prop && row.cells[2].textContent === 'true'))`, 'Properties defaults')
  // Opening example omits every dismissal prop.
  for (const action of ['backdrop', 'Escape', 'X', 'footer']) {
    await click('#modal button[aria-haspopup="dialog"]')
    await check("document.querySelector('#modal dialog').open", 'omitted defaults open')
    if (action === 'backdrop') {
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1 })
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1 })
    } else if (action === 'Escape') {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    } else await click(action === 'X' ? '#modal dialog button[aria-label="Tutup modal"]' : '#modal dialog > div:last-child button')
    await wait()
    await check("!document.querySelector('#modal dialog').open", `omitted defaults ${action}`)
  }
  console.log('PASS: 16 variant/control combinations; omitted defaults; Properties defaults')
} finally {
  socket.close()
}

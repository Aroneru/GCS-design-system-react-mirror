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
  if (!pending) return
  requests.delete(message.id)
  if (message.error) pending.reject(message.error)
  else pending.resolve(message.result)
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
const check = async (expression, label) => assert(await evaluate(expression), label)

try {
  await send('Page.enable')
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/#/components/avatar' })
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate("!!document.querySelector('#playground input[aria-label=\\\"Nama untuk preview Avatar\\\"]')")) break
    await wait()
  }

  await check("[...document.querySelectorAll('#inisial pre code')].some((code) => code.textContent.includes('initials=\\\"UI\\\"'))", 'snippet override memakai UI')
  await check("![...document.querySelectorAll('#inisial pre code')].some((code) => code.textContent.includes('initials=\\\"PT\\\"'))", 'snippet override tidak memakai PT')
  await check("[...document.querySelectorAll('#avatar pre code')].some((code) => code.textContent.includes('alt=\\\"\\\"') && code.textContent.includes('<span>Putri Handayani</span>'))", 'contoh alt dekoratif menyertakan nama pendamping')

  await evaluate(`(() => {
    const group = [...document.querySelectorAll('#playground [role=group]')]
      .find((candidate) => candidate.getAttribute('aria-label') === 'Pilih isi Avatar')
    ;[...group.querySelectorAll('button')].find((button) => button.textContent === 'Initials').click()
  })()`)
  await wait()
  await evaluate(`(() => {
    const input = document.querySelector('#playground input[aria-label="Nama untuk preview Avatar"]')
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setValue.call(input, '')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })()`)
  await wait()
  await check("document.querySelector('#playground [role=status]').textContent.includes('initials UI')", 'nama kosong memberi fallback eksplisit')
  await check("(() => { const code = document.querySelector('#penggunaan pre code').textContent; return code.includes('initials=\\\"UI\\\"') && code.includes('alt=\\\"\\\"') && code.includes('<span>Tanpa nama</span>') })()", 'snippet nama kosong tetap valid dan semantik sama')

  await evaluate(`(() => {
    const input = document.querySelector('#playground input[aria-label="Nama untuk preview Avatar"]')
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setValue.call(input, 'Putri Handayani')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    const click = (label, text) => [...document.querySelectorAll('#playground [role=group]')]
      .find((group) => group.getAttribute('aria-label') === label)
      .querySelectorAll('button')
      .forEach((button) => { if (button.textContent === text) button.click() })
    click('Pilih theme', 'Dark')
    click('Pilih ukuran', 'S')
    click('Pilih isi Avatar', 'Foto')
  })()`)
  await wait()
  await check("(() => { const code = document.querySelector('#penggunaan pre code').textContent; return code.includes('data-theme=\\\"dark\\\"') && code.includes('size=\\\"small\\\"') && code.includes('src=') && code.includes('name=\\\"Putri Handayani\\\"') && code.includes('alt=\\\"\\\"') && code.includes('<div className=\\\"flex items-center gap-3\\\">') })()", 'snippet mengikuti theme, size, foto, dan struktur preview')

  await evaluate(`(() => {
    const click = (label, text) => [...document.querySelectorAll('#playground [role=group]')]
      .find((group) => group.getAttribute('aria-label') === label)
      .querySelectorAll('button')
      .forEach((button) => { if (button.textContent === text) button.click() })
    click('Pilih isi Avatar', 'Profile')
  })()`)
  await wait()
  await evaluate(`(() => {
    const group = [...document.querySelectorAll('#playground [role=group]')]
      .find((candidate) => candidate.getAttribute('aria-label') === 'Pilih ilustrasi profile')
    ;[...group.querySelectorAll('button')].find((button) => button.textContent === 'Male').click()
  })()`)
  await wait()
  await check("document.querySelector('#penggunaan pre code').textContent.includes('fallback=\\\"male\\\"')", 'snippet mengikuti profile fallback')

  const results = await evaluate(`(async () => {
    const reactModule = await import('/node_modules/.vite/deps/react.js')
    const React = reactModule.default ?? reactModule
    const reactDomModule = await import('/node_modules/.vite/deps/react-dom_client.js')
    const createRoot = reactDomModule.createRoot ?? reactDomModule.default.createRoot
    const { Avatar } = await import('/src/lib/components/Avatar.tsx')
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const photoA = 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3C/svg%3E#a'
    const photoB = 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3C/svg%3E#b'
    const photoFemale = 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3C/svg%3E#female'
    const photoMale = 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3C/svg%3E#male'
    const wait = () => new Promise((resolve) => setTimeout(resolve, 100))
    const render = async (props, wrapperTheme) => {
      if (wrapperTheme) {
        root.render(React.createElement('div', { 'data-theme': wrapperTheme }, React.createElement(Avatar, props)))
      } else {
        root.render(React.createElement(Avatar, props))
      }
      await wait()
      return host.querySelector('[class*=rounded-full]')
    }
    const fail = async () => {
      host.querySelector('img').dispatchEvent(new Event('error', { bubbles: true }))
      await wait()
    }
    const output = {}

    await render({ name: 'Putri' })
    output.single = host.textContent === 'PU'
    await render({ name: 'Putri Handayani' })
    output.multi = host.textContent === 'PH'
    await render({ name: '👩‍💻 Putri' })
    output.unicode = host.textContent === '👩‍💻P'
    await render({ name: 'Putri Handayani', initials: 'UI' })
    output.override = host.textContent === 'UI'

    await render({ src: photoA, name: 'Putri Handayani' })
    output.photoPriority = host.querySelector('img').getAttribute('src').endsWith('#a')
    await fail()
    output.photoFailureInitials = host.textContent === 'PH'

    await render({ src: photoFemale, fallback: 'female' })
    await fail()
    output.photoFailureFemale = host.querySelectorAll('img').length === 2
    await render({ src: photoMale, fallback: 'male' })
    await fail()
    output.photoFailureMale = host.querySelectorAll('img').length === 2

    await render({ src: photoA, name: 'Putri Handayani' })
    await fail()
    await render({ src: photoB, name: 'Putri Handayani' })
    const bLoaded = host.querySelector('img').getAttribute('src').endsWith('#b')
    await render({ src: photoA, name: 'Putri Handayani' })
    output.retryOldUrl = bLoaded && host.querySelector('img').getAttribute('src').endsWith('#a')

    let avatar = await render({ initials: 'UI', alt: '' })
    output.decorative = !avatar.hasAttribute('role') && !avatar.hasAttribute('aria-label')
    avatar = await render({ initials: 'UI', alt: 'Nama khusus' })
    output.altName = avatar.getAttribute('role') === 'img' && avatar.getAttribute('aria-label') === 'Nama khusus'
    avatar = await render({ name: 'Putri Handayani' })
    output.nameAccessible = avatar.getAttribute('aria-label') === 'Putri Handayani'

    output.sizes = (await render({ name: 'P', size: 'small' })).className.includes('size-6')
      && (await render({ name: 'P', size: 'default' })).className.includes('size-8')
      && (await render({ name: 'P', size: 'large' })).className.includes('size-20')

    avatar = await render({ name: 'P' }, 'dark')
    const dark = getComputedStyle(avatar).backgroundColor === 'rgb(31, 42, 55)'
    root.render(React.createElement('div', { 'data-theme': 'dark' }, React.createElement('div', { 'data-theme': 'light' }, React.createElement(Avatar, { name: 'P' }))))
    await wait()
    const nested = getComputedStyle(host.querySelector('[class*=rounded-full]')).backgroundColor === 'rgb(243, 244, 246)'
    output.ambientTheme = dark && nested

    root.unmount()
    host.remove()
    return output
  })()`)

  for (const [name, passed] of Object.entries(results)) assert.equal(passed, true, name)
  console.log('Avatar runtime checks passed')
} finally {
  socket.close()
}

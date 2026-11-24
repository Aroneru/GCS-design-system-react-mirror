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
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
  return result.result.value
}

const wait = (duration = 100) => new Promise((resolve) => setTimeout(resolve, duration))
const check = async (expression, label) => assert(await evaluate(expression), label)

try {
  await send('Page.enable')
  await send('Emulation.setFocusEmulationEnabled', { enabled: true })
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/#/components/popover' })

  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate("!!document.querySelector('#playground button[aria-controls]')")) break
    await wait()
  }

  await evaluate(`(async () => {
    const React = (await import('/node_modules/.vite/deps/react.js')).default
    const { createRoot } = (await import('/node_modules/.vite/deps/react-dom_client.js')).default
    const { Popover } = await import('/src/lib/components/Popover.tsx')
    const h = React.createElement

    window.__popoverTest = { events: [], errors: {} }

    class Boundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }
      static getDerivedStateFromError(error) {
        return { error }
      }
      componentDidCatch(error) {
        window.__popoverTest.errors[this.props.name] = error.message
      }
      render() {
        return this.state.error ? null : this.props.children
      }
    }

    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return h(Popover, {
        open,
        onOpenChange: (next) => {
          window.__popoverTest.events.push('controlled:' + next)
          setOpen(next)
        },
        trigger: h('button', { id: 'controlled-trigger', type: 'button' }, 'Controlled'),
        title: 'Controlled',
      }, 'Body')
    }

    function CustomButton(props) {
      return h('button', props, 'Custom')
    }

    const host = document.createElement('div')
    host.id = 'popover-trigger-runtime'
    document.body.append(host)
    createRoot(host).render(h(React.Fragment, null,
      h(Popover, {
        onOpenChange: (next) => window.__popoverTest.events.push('normal-change:' + next),
        trigger: h('button', {
          id: 'normal-trigger',
          type: 'button',
          'aria-label': 'Open details',
          onClick: () => window.__popoverTest.events.push('consumer-click'),
        }, 'Normal'),
        title: 'Normal',
      }, h('button', { id: 'inside-popover', type: 'button' }, 'Inside')),
      h(Popover, {
        onOpenChange: () => window.__popoverTest.events.push('prevent-change'),
        trigger: h('button', {
          id: 'prevent-trigger',
          type: 'button',
          onClick: (event) => event.preventDefault(),
        }, 'Prevent'),
        title: 'Prevent',
      }, 'Body'),
      h(Popover, {
        onOpenChange: () => window.__popoverTest.events.push('disabled-change'),
        trigger: h('button', { id: 'disabled-trigger', type: 'button', disabled: true }, 'Disabled'),
        title: 'Disabled',
      }, 'Body'),
      h(Controlled),
      h(Boundary, { name: 'div' },
        h(Popover, { trigger: h('div', null, 'Div'), title: 'Invalid' }, 'Body')),
      h(Boundary, { name: 'wrapped' },
        h(Popover, { trigger: h('span', null, h('button', null, 'Wrapped')), title: 'Invalid' }, 'Body')),
      h(Boundary, { name: 'custom' },
        h(Popover, { trigger: h(CustomButton), title: 'Invalid' }, 'Body')),
    ))
  })()`)
  await wait(200)

  const contractError =
    '[Popover] `trigger` must be a native <button> element. Div/span elements, Fragments, wrapped buttons, and custom components are not supported.'
  assert.deepEqual(await evaluate('window.__popoverTest.errors'), {
    div: contractError,
    wrapped: contractError,
    custom: contractError,
  })

  await evaluate("document.querySelector('#normal-trigger').click()")
  await wait()
  await check("window.__popoverTest.events[0] === 'consumer-click'", 'consumer onClick runs first')
  await check("window.__popoverTest.events[1] === 'normal-change:true'", 'internal open follows')
  await check("document.querySelector('#normal-trigger').getAttribute('aria-expanded') === 'true'", 'aria-expanded open')
  await check("document.getElementById(document.querySelector('#normal-trigger').getAttribute('aria-controls')).matches(':popover-open')", 'aria-controls target opens')

  await evaluate("document.querySelector('#normal-trigger').click()")
  await wait()
  await evaluate("document.querySelector('#prevent-trigger').click(); document.querySelector('#disabled-trigger').click()")
  await wait()
  await check("!window.__popoverTest.events.includes('prevent-change')", 'preventDefault blocks toggle')
  await check("!window.__popoverTest.events.includes('disabled-change')", 'disabled button does not toggle')

  await evaluate("document.querySelector('#controlled-trigger').click()")
  await wait()
  await check("window.__popoverTest.events.includes('controlled:true')", 'controlled visibility callback')
  await check("document.querySelector('#controlled-trigger').getAttribute('aria-expanded') === 'true'", 'controlled aria-expanded')

  await evaluate("document.querySelector('#normal-trigger').focus()")
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
  await wait()
  await check("document.querySelector('#normal-trigger').getAttribute('aria-expanded') === 'true'", 'Enter activates native button')

  await evaluate("document.querySelector('#normal-trigger').click(); document.querySelector('#normal-trigger').focus()")
  await wait()
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
  await wait()
  await check("document.querySelector('#normal-trigger').getAttribute('aria-expanded') === 'true'", 'Space activates native button')

  await evaluate("document.querySelector('#inside-popover').focus()")
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await wait(200)
  await check("document.activeElement.id === 'normal-trigger'", 'Escape restores focus')
  await check("document.querySelector('#normal-trigger').getAttribute('aria-expanded') === 'false'", 'Escape synchronizes state')

  console.log('PASS: trigger contract, ARIA, event order, preventDefault, disabled, controlled/uncontrolled, keyboard, focus restoration')
} finally {
  socket.close()
}

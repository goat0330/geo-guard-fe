import { getToken } from '@/utils/index.js'
import { useUserStore } from '@/store/user.js'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export const createStreamRequest = ({
                                      url,
                                      method = 'POST',
                                      headers = {},
                                      body,
                                      onMessage,
                                      onOpen,
                                      useRetry = false,
                                      longConnection = false,
                                    }) => {
  let controller = null
  let retryCount = 0
  const MAX_RETRY = 5

  let closedByUser = false
  let reconnectTimer = null
  let reconnecting = false

  const connect = async () => {
    if (closedByUser) return

    controller = new AbortController()

    try {
      await fetchEventSource(url, {
        method,

        headers: {
          'Content-Type': 'application/json',
          [import.meta.env.VITE_APP_TOKEN_KEY]: getToken(),
          ...headers,
        },

        body: body ? JSON.stringify(body) : undefined,

        signal: controller.signal,

        openWhenHidden: true,

        // 禁用内置重试
        retry: 0,

        async onopen(res) {
          if (res.status !== 200) {
            throw new Error(`HTTP ${res.status}`)
          }

          // 连接成功
          retryCount = 0

          onOpen?.()
        },

        onmessage(msg) {
          parseSSEEvent(msg?.data, onMessage)
        },

        onclose() {
          // 服务端关闭
          throw new Error('SSE closed')
        },

        onerror(err) {
          // 抛出去走 catch
          throw err
        },
      })
    } catch (err) {
      if (closedByUser) return

      if (useRetry || longConnection) {
        retry()
      }
    }
  }

  const retry = () => {
    if (reconnecting) return

    if (!longConnection && retryCount >= MAX_RETRY) {
      return
    }

    reconnecting = true

    retryCount++

    controller?.abort()

    reconnectTimer = setTimeout(() => {
      reconnecting = false
      connect()
    }, 3000)
  }

  connect()

  return {
    abort() {
      closedByUser = true

      clearTimeout(reconnectTimer)

      controller?.abort()
    },
  }
}

export const parseSSEEvent = (dataStr, onMessage) => {
  try {
    onMessage?.(JSON.parse(dataStr))
  } catch {
    onMessage?.(dataStr)
  }
}

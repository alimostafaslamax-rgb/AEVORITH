---
name: Vite Proxy for API
description: How the aevorith frontend reaches the api-server in development.
---

# Vite Dev Proxy

The aevorith Vite config proxies all `/api` requests to the api-server:

```ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
    },
  },
}
```

**Why:** The frontend and api-server run on different ports. Without the proxy, `/api/ai/chat` calls from the browser would fail with CORS or connection errors in development. The proxy makes them work transparently.

**How to apply:** Any new frontend fetch to `/api/...` routes through to the Express server automatically. No base URL needed in fetch calls — just `/api/route`.

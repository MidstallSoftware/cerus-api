import { Histogram } from 'prom-client'

export const httpRequestMetric = new Histogram({
  name: 'cerus_api_http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
})

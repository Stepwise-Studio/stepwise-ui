import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000'

// Keyless-tolerant: Stripe's SDK throws on an empty api key, so the provider is
// only registered once STRIPE_API_KEY is present. Razorpay is ours and guards
// itself, so it is always registered.
const stripeProvider = process.env.STRIPE_API_KEY
  ? [
      {
        resolve: '@medusajs/payment-stripe',
        id: 'stripe',
        options: {
          apiKey: process.env.STRIPE_API_KEY,
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: [
    { resolve: './src/modules/prescription' },
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            // dev only. For production a merchant swaps this for
            // `@medusajs/file-s3` (or any provider) — nothing else changes.
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',
              backend_url: `${BACKEND_URL}/static`,
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          ...stripeProvider,
          {
            resolve: './src/modules/razorpay',
            id: 'razorpay',
            options: {
              keyId: process.env.RAZORPAY_KEY_ID,
              keySecret: process.env.RAZORPAY_KEY_SECRET,
              webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
  ],
})

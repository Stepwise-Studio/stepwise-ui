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
              // Prescriptions are medical records, and this is the line that
              // keeps them off the public web.
              //
              // `@medusajs/file-local` defaults `private_upload_dir` to the SAME
              // `static/` folder it serves over HTTP — its own source says so:
              // "there is no way to serve private files through a static
              // server, so we simply place them in static". The framework mounts
              // express.static on /static before Medusa's API router, so no
              // route middleware can intercept it either. Result on the default
              // config: an uploaded prescription scan is readable by anyone with
              // the filename, no session required. Verified before this change.
              //
              // Pointing private uploads outside the served directory is the
              // provider's own supported escape hatch. The documented cost is
              // that presigned URLs stop working, which costs us nothing:
              // pharmacists read scans through GET /admin/prescriptions/:id/file,
              // which streams via `getAsBuffer` — and that resolves the private
              // directory from the `private-` filename prefix, so it keeps
              // working unchanged.
              private_upload_dir: 'uploads/private',
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

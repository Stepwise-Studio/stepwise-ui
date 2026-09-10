import { medusaIntegrationTestRunner } from '@medusajs/test-utils'
import type { MedusaContainer } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import seedMedixGo from '../../src/scripts/seed'
import { PRESCRIPTION_MODULE } from '../../src/modules/prescription'

jest.setTimeout(120_000)

type Ctx = {
  headers: Record<string, string>
  regionId: string
  rxVariantId: string
  otcVariantId: string
  shippingOptionId: string
}

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let container: MedusaContainer
    let ctx: Ctx

    beforeAll(async () => {
      container = getContainer()
      // Reuse the real seed — the gate is only meaningful against real data.
      await seedMedixGo({ container, args: [] } as any)

      const query = container.resolve(ContainerRegistrationKeys.QUERY)

      const { data: keys } = await query.graph({
        entity: 'api_key',
        fields: ['token'],
        filters: { title: 'MedixGo Storefront Key' },
      })
      const { data: regions } = await query.graph({
        entity: 'region',
        fields: ['id', 'name'],
      })
      const { data: products } = await query.graph({
        entity: 'product',
        fields: ['handle', 'variants.id'],
      })
      const { data: shippingOptions } = await query.graph({
        entity: 'shipping_option',
        fields: ['id', 'name'],
      })

      const byHandle = (h: string) =>
        products.find((p: any) => p.handle === h)!.variants[0].id

      ctx = {
        headers: { 'x-publishable-api-key': keys[0].token },
        regionId: regions.find((r: any) => r.name === 'India')!.id,
        rxVariantId: byHandle('acme-pain-relief'),
        otcVariantId: byHandle('acme-vitamin-c'),
        shippingOptionId: shippingOptions[0].id,
      }
    })

    /** Builds a cart that is complete in every respect except the prescription. */
    const buildCheckoutReadyCart = async (variantId: string) => {
      const { data: created } = await api.post(
        '/store/carts',
        {
          region_id: ctx.regionId,
          email: 'asha@example.com',
          items: [{ variant_id: variantId, quantity: 1 }],
          shipping_address: {
            first_name: 'Asha',
            last_name: 'Menon',
            address_1: '12 Linking Road',
            city: 'Mumbai',
            country_code: 'in',
            postal_code: '400050',
          },
        },
        { headers: ctx.headers }
      )
      const cartId = created.cart.id

      await api.post(
        `/store/carts/${cartId}/shipping-methods`,
        { option_id: ctx.shippingOptionId },
        { headers: ctx.headers }
      )

      const { data: pc } = await api.post(
        '/store/payment-collections',
        { cart_id: cartId },
        { headers: ctx.headers }
      )
      await api.post(
        `/store/payment-collections/${pc.payment_collection.id}/payment-sessions`,
        { provider_id: 'pp_system_default' },
        { headers: ctx.headers }
      )

      return cartId
    }

    const complete = (cartId: string) =>
      api
        .post(`/store/carts/${cartId}/complete`, {}, { headers: ctx.headers })
        .catch((e: any) => e.response)

    /** Uploads a prescription and attaches it to the cart via the contract route. */
    const attachPrescription = async (
      cartId: string,
      status: 'pending' | 'approved' | 'rejected'
    ) => {
      const service: any = container.resolve(PRESCRIPTION_MODULE)
      const created = await service.createPrescriptions({
        status: 'pending',
        file_id: 'test-file',
        file_url: 'http://localhost:9000/static/test-file.png',
        patient_name: 'Asha Menon',
      })

      await api.post(
        `/store/carts/${cartId}/prescription`,
        { prescription_id: created.id },
        { headers: ctx.headers }
      )

      if (status !== 'pending') {
        await service.updatePrescriptions({
          id: created.id,
          status,
          note: status === 'rejected' ? 'Illegible.' : 'Verified.',
          reviewed_at: new Date(),
        })
      }
      return created.id
    }

    describe('prescription gate on cart completion', () => {
      it('case 1: cart without prescription-only items completes', async () => {
        const cartId = await buildCheckoutReadyCart(ctx.otcVariantId)
        const res = await complete(cartId)

        expect(res.status).toBe(200)
        expect(res.data.type).toBe('order')
        expect(res.data.order.id).toEqual(expect.stringContaining('order_'))
      })

      it('case 2: Rx cart with NO prescription is blocked', async () => {
        const cartId = await buildCheckoutReadyCart(ctx.rxVariantId)
        const res = await complete(cartId)

        expect(res.status).toBe(400)
        expect(res.data.code).toBe('prescription_required')
        expect(res.data.message).toEqual(expect.stringContaining('Upload a prescription'))
      })

      it('case 3: Rx cart with a PENDING prescription is blocked', async () => {
        const cartId = await buildCheckoutReadyCart(ctx.rxVariantId)
        await attachPrescription(cartId, 'pending')
        const res = await complete(cartId)

        expect(res.status).toBe(400)
        expect(res.data.code).toBe('prescription_required')
        expect(res.data.message).toEqual(
          expect.stringContaining('awaiting pharmacist review')
        )
      })

      it('case 4: Rx cart with an APPROVED prescription completes', async () => {
        const cartId = await buildCheckoutReadyCart(ctx.rxVariantId)
        await attachPrescription(cartId, 'approved')
        const res = await complete(cartId)

        expect(res.status).toBe(200)
        expect(res.data.type).toBe('order')
        expect(res.data.order.id).toEqual(expect.stringContaining('order_'))
      })

      it('bonus: a REJECTED prescription is blocked and surfaces the note', async () => {
        const cartId = await buildCheckoutReadyCart(ctx.rxVariantId)
        await attachPrescription(cartId, 'rejected')
        const res = await complete(cartId)

        expect(res.status).toBe(400)
        expect(res.data.code).toBe('prescription_required')
        expect(res.data.message).toEqual(expect.stringContaining('Illegible.'))
      })
    })
  },
})

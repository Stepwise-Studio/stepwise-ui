import type { ExecArgs } from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from '@medusajs/framework/utils'
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from '@medusajs/medusa/core-flows'

/**
 * MedixGo seed — idempotent.
 *
 * Every block looks the record up first and reuses it. Re-running this script
 * changes nothing and prints the same publishable key.
 *
 * Units: Medusa's native prices are **decimal major units** (32 = ₹32.00).
 * `variant.metadata.mrp` is in **minor units (paise)** per CONTRACT.md, so a
 * ₹40 MRP is stored as 4000. See the "Units" note in CONTRACT.md.
 */

const CATEGORIES = [
  { handle: 'pain-fever', name: 'Pain & Fever' },
  { handle: 'cold-cough', name: 'Cold & Cough' },
  { handle: 'vitamins-supplements', name: 'Vitamins & Supplements' },
  { handle: 'diabetes-care', name: 'Diabetes Care' },
  { handle: 'skin-care', name: 'Skin Care' },
  { handle: 'baby-care', name: 'Baby Care' },
]

type SeedProduct = {
  handle: string
  title: string
  description: string
  category: string
  thumbnail: string
  brand: string
  composition: string
  requires_prescription: boolean
  variant: {
    title: string
    sku: string
    dosage: string
    inr: number
    usd: number
    mrp_paise: number
  }
}

const PRODUCTS: SeedProduct[] = [
  {
    handle: 'acme-pain-relief',
    title: 'ACME Pain Relief',
    description:
      'Paracetamol 650 mg for the relief of fever, headache, body ache and post-vaccination soreness. Sold against a valid prescription.',
    category: 'pain-fever',
    thumbnail:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    brand: 'ACME',
    composition: 'Paracetamol 650 mg',
    // The gate demo lives here — this is the one Rx-only product.
    requires_prescription: true,
    variant: {
      title: 'Strip of 15 tablets',
      sku: 'ACME-PAIN-650-15',
      dosage: '650 mg',
      inr: 32,
      usd: 0.4,
      mrp_paise: 4000,
    },
  },
  {
    handle: 'acme-vitamin-c',
    title: 'ACME Vitamin C',
    description:
      'Vitamin C 1000 mg chewable tablets with natural amla extract. Supports immunity and everyday antioxidant needs.',
    category: 'vitamins-supplements',
    thumbnail:
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
    brand: 'ACME',
    composition: 'Ascorbic Acid 1000 mg',
    requires_prescription: false,
    variant: {
      title: 'Bottle of 60 tablets',
      sku: 'ACME-VITC-1000-60',
      dosage: '1000 mg',
      inr: 299,
      usd: 3.6,
      mrp_paise: 39900,
    },
  },
  {
    handle: 'acme-antacid',
    title: 'ACME Antacid',
    description:
      'Fast-acting antacid suspension for heartburn, acid reflux and indigestion. Mint flavour, sugar free.',
    category: 'pain-fever',
    thumbnail:
      'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800&q=80',
    brand: 'ACME',
    composition: 'Magaldrate 400 mg + Simethicone 20 mg',
    requires_prescription: false,
    variant: {
      title: 'Bottle of 170 ml',
      sku: 'ACME-ANTACID-170',
      dosage: '10 ml after meals',
      inr: 85.5,
      usd: 1.05,
      mrp_paise: 11000,
    },
  },
  {
    handle: 'acme-ors',
    title: 'ACME ORS',
    description:
      'WHO-formula Oral Rehydration Salts for dehydration from diarrhoea, vomiting or heat. Orange flavour, dissolves in 1 litre of water.',
    category: 'baby-care',
    thumbnail:
      'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800&q=80',
    brand: 'ACME',
    composition: 'Oral Rehydration Salts (WHO formula) 21.8 g',
    requires_prescription: false,
    variant: {
      title: 'Pack of 5 sachets',
      sku: 'ACME-ORS-5',
      dosage: '1 sachet in 1 litre water',
      inr: 18,
      usd: 0.25,
      mrp_paise: 2200,
    },
  },
]

export default async function seedMedixGo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const storeModuleService = container.resolve(Modules.STORE)

  // ---- sales channel -------------------------------------------------------
  let { data: salesChannels } = await query.graph({
    entity: 'sales_channel',
    fields: ['id', 'name'],
    filters: { name: 'MedixGo Storefront' },
  })

  if (!salesChannels.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          { name: 'MedixGo Storefront', description: 'Online pharmacy storefront' },
        ],
      },
    })
    salesChannels = result as any
    logger.info('Created sales channel.')
  }
  const salesChannel = salesChannels[0]

  // ---- store ---------------------------------------------------------------
  const [store] = await storeModuleService.listStores()
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: 'MedixGo',
        supported_currencies: [
          { currency_code: 'inr', is_default: true },
          { currency_code: 'usd', is_default: false },
        ],
        default_sales_channel_id: salesChannel.id,
      },
    },
  })

  // ---- publishable api key -------------------------------------------------
  const { data: existingKeys } = await query.graph({
    entity: 'api_key',
    fields: ['id', 'token', 'title', 'type'],
    filters: { title: 'MedixGo Storefront Key' },
  })

  let publishableKey = existingKeys[0]
  if (!publishableKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          { title: 'MedixGo Storefront Key', type: 'publishable', created_by: 'seed' },
        ],
      },
    })
    publishableKey = result[0] as any
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: publishableKey.id, add: [salesChannel.id] },
    })
    logger.info('Created publishable API key.')
  }

  // ---- regions -------------------------------------------------------------
  // `razorpay` is always registered; `stripe` only when STRIPE_API_KEY is set.
  const paymentProviders = ['pp_system_default', 'pp_razorpay_razorpay']
  if (process.env.STRIPE_API_KEY) {
    paymentProviders.push('pp_stripe_stripe')
  }

  const wantedRegions = [
    { name: 'India', currency_code: 'inr', countries: ['in'] },
    { name: 'United States', currency_code: 'usd', countries: ['us'] },
  ]

  for (const wanted of wantedRegions) {
    const { data: found } = await query.graph({
      entity: 'region',
      fields: ['id', 'name'],
      filters: { name: wanted.name },
    })
    if (found.length) continue

    await createRegionsWorkflow(container).run({
      input: { regions: [{ ...wanted, payment_providers: paymentProviders }] },
    })
    logger.info(`Created region ${wanted.name}.`)
  }

  const { data: allRegions } = await query.graph({
    entity: 'region',
    fields: ['id', 'name', 'currency_code'],
  })
  const indiaRegion = allRegions.find((r: any) => r.name === 'India')!

  // ---- tax regions ---------------------------------------------------------
  for (const country of ['in', 'us']) {
    const { data: found } = await query.graph({
      entity: 'tax_region',
      fields: ['id'],
      filters: { country_code: country },
    })
    if (found.length) continue
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: country, provider_id: 'tp_system' }],
    })
  }

  // ---- stock location ------------------------------------------------------
  let { data: stockLocations } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name'],
    filters: { name: 'MedixGo Mumbai Warehouse' },
  })

  if (!stockLocations.length) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: 'MedixGo Mumbai Warehouse',
            address: { city: 'Mumbai', country_code: 'IN', address_1: 'Andheri East' },
          },
        ],
      },
    })
    stockLocations = result as any

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocations[0].id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: 'manual_manual' },
    })
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocations[0].id, add: [salesChannel.id] },
    })
    logger.info('Created stock location.')
  }
  const stockLocation = stockLocations[0]

  // ---- fulfillment set + shipping option -----------------------------------
  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id'],
  })

  // Core migrations normally create a default profile; a bare database (and the
  // integration test runner's) has none.
  let shippingProfile = shippingProfiles[0]
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: 'Default', type: 'default' }] },
    })
    shippingProfile = result[0] as any
    logger.info('Created default shipping profile.')
  }

  const existingSets = await fulfillmentModuleService.listFulfillmentSets(
    { name: 'MedixGo Delivery' },
    { relations: ['service_zones'] }
  )

  let fulfillmentSet = existingSets[0]
  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: 'MedixGo Delivery',
      type: 'shipping',
      service_zones: [
        {
          name: 'India & US',
          geo_zones: [
            { country_code: 'in', type: 'country' },
            { country_code: 'us', type: 'country' },
          ],
        },
      ],
    })
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
    logger.info('Created fulfillment set.')
  }

  const { data: existingOptions } = await query.graph({
    entity: 'shipping_option',
    fields: ['id', 'name'],
    filters: { name: 'Standard Delivery' },
  })

  if (!existingOptions.length) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: 'Standard Delivery',
          price_type: 'flat',
          provider_id: 'manual_manual',
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: 'Standard',
            description: 'Delivered in 2-4 working days.',
            code: 'standard',
          },
          prices: [
            { currency_code: 'inr', amount: 40 },
            { currency_code: 'usd', amount: 5 },
            { region_id: indiaRegion.id, amount: 40 },
          ],
          rules: [
            { attribute: 'enabled_in_store', value: 'true', operator: 'eq' },
            { attribute: 'is_return', value: 'false', operator: 'eq' },
          ],
        },
      ],
    })
    logger.info('Created shipping option.')
  }

  // ---- categories ----------------------------------------------------------
  const { data: existingCategories } = await query.graph({
    entity: 'product_category',
    fields: ['id', 'handle'],
  })
  const byHandle = new Map<string, any>(
    existingCategories.map((c: any) => [c.handle, c])
  )

  const missingCategories = CATEGORIES.filter((c) => !byHandle.has(c.handle))
  if (missingCategories.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((c) => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
        })),
      },
    })
    result.forEach((c: any) => byHandle.set(c.handle, c))
    logger.info(`Created ${missingCategories.length} categories.`)
  }

  // ---- products ------------------------------------------------------------
  const { data: existingProducts } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle'],
  })
  const existingHandles = new Set(existingProducts.map((p: any) => p.handle))

  const toCreate = PRODUCTS.filter((p) => !existingHandles.has(p.handle))

  if (toCreate.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: toCreate.map((p) => ({
          title: p.title,
          handle: p.handle,
          description: p.description,
          status: ProductStatus.PUBLISHED,
          thumbnail: p.thumbnail,
          images: [{ url: p.thumbnail }],
          category_ids: [byHandle.get(p.category)!.id],
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: salesChannel.id }],
          metadata: {
            brand: p.brand,
            composition: p.composition,
            requires_prescription: p.requires_prescription,
          },
          options: [{ title: 'Pack', values: [p.variant.title] }],
          variants: [
            {
              title: p.variant.title,
              sku: p.variant.sku,
              options: { Pack: p.variant.title },
              manage_inventory: true,
              metadata: {
                dosage: p.variant.dosage,
                // minor units (paise) — see CONTRACT.md "Units"
                mrp: p.variant.mrp_paise,
              },
              prices: [
                { currency_code: 'inr', amount: p.variant.inr },
                { currency_code: 'usd', amount: p.variant.usd },
              ],
            },
          ],
        })),
      },
    })
    logger.info(`Created ${toCreate.length} products.`)
  }

  // ---- inventory levels ----------------------------------------------------
  const { data: inventoryItems } = await query.graph({
    entity: 'inventory_item',
    fields: ['id'],
  })
  const { data: inventoryLevels } = await query.graph({
    entity: 'inventory_level',
    fields: ['id', 'inventory_item_id', 'location_id'],
  })
  const levelled = new Set(
    inventoryLevels.map((l: any) => `${l.inventory_item_id}:${l.location_id}`)
  )

  const missingLevels = inventoryItems.filter(
    (item: any) => !levelled.has(`${item.id}:${stockLocation.id}`)
  )

  if (missingLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: missingLevels.map((item: any) => ({
          location_id: stockLocation.id,
          inventory_item_id: item.id,
          stocked_quantity: 500,
        })),
      },
    })
    logger.info(`Created ${missingLevels.length} inventory levels.`)
  }

  logger.info('MedixGo seed complete.')
  // eslint-disable-next-line no-console
  console.log(
    [
      '',
      '─'.repeat(64),
      '  MedixGo publishable API key (storefront NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY):',
      '',
      `    ${publishableKey.token}`,
      '',
      `  Default region: India / INR   (region_id: ${indiaRegion.id})`,
      '  Rx-gated product: acme-pain-relief (requires_prescription: true)',
      '─'.repeat(64),
      '',
    ].join('\n')
  )
}

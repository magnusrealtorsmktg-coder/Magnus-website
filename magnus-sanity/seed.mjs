/**
 * Full importer: wipes the managed content and re-imports every editable
 * section (locations, properties, featured projects, owners, reviews,
 * market insights, site settings) with images.
 *
 * Because properties now LINK to location documents, this must run as one job
 * so the references line up. It deletes existing docs of these types first,
 * which is why it's safe to re-run.
 *
 * RUN (from the magnus-sanity folder, with an Editor token):
 *   export SANITY_PROJECT_ID=93f80h7a
 *   export SANITY_TOKEN=your_editor_token
 *   node seed.mjs
 */
import {createClient} from '@sanity/client'
import {SEED} from './seed-data.mjs'
import {MKT, MKT_CTX, MKT_LABEL, CITY_SNAP, PROJECTS, OWNERS, REVIEWS, SETTINGS} from './seed-content.mjs'

const projectId = process.env.SANITY_PROJECT_ID
const token = process.env.SANITY_TOKEN
const dataset = process.env.SANITY_DATASET || 'production'

if (!projectId || !token) {
  console.error('Missing env vars. Run:\n  export SANITY_PROJECT_ID=xxxx\n  export SANITY_TOKEN=yyyy\n  node seed.mjs')
  process.exit(1)
}

const client = createClient({projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false})

const MANAGED_TYPES = ['property', 'city', 'featuredProject', 'teamMember', 'review', 'marketInsights', 'siteSettings']

async function uploadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Could not fetch image: ' + url)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {filename: url.split('/').pop().split('?')[0]})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function wipe() {
  console.log('Clearing existing managed content ...')
  await client.delete({query: `*[_type in $types]`, params: {types: MANAGED_TYPES}})
}

async function run() {
  await wipe()

  // ---- 1. Locations (cities) — fixed ids so properties can reference them ----
  const citySlugs = Object.keys(MKT_LABEL).filter((s) => s !== 'all')
  const cityIdBySlug = {}
  let cOrder = 0
  for (const slug of citySlugs) {
    cOrder += 1
    const id = 'city-' + slug
    cityIdBySlug[slug] = id
    const snap = CITY_SNAP[slug] || {tag: '', stats: []}
    await client.createOrReplace({
      _id: id,
      _type: 'city',
      name: MKT_LABEL[slug],
      slug: {_type: 'slug', current: slug},
      order: cOrder,
      marketContext: MKT_CTX[slug] || '',
      snapshotTag: snap.tag || '',
      snapshotStats: (snap.stats || []).map(([value, label], i) => ({_type: 'object', _key: 'snap' + i, value, label})),
    })
    console.log('  city:', MKT_LABEL[slug])
  }

  // ---- 2. Market insights (region-level singleton) ----
  const regionSnap = CITY_SNAP.all || {tag: 'Region overview', stats: []}
  await client.createOrReplace({
    _id: 'marketInsights',
    _type: 'marketInsights',
    asOf: MKT.asOf || '',
    regionContext: MKT_CTX.all || '',
    regionSnapshotTag: regionSnap.tag || '',
    regionSnapshotStats: (regionSnap.stats || []).map(([value, label], i) => ({_type: 'object', _key: 'rsnap' + i, value, label})),
    indicators: (MKT.indicators || []).map((ind, idx) => ({_type: 'object', _key: 'ind' + idx, value: ind.v, label: ind.l, source: ind.s})),
  })
  console.log('  market insights')

  // ---- 3. Site settings (singleton) ----
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    phone: SETTINGS.phone || '',
    email: SETTINGS.email || '',
    instagram: SETTINGS.instagram || '',
    ownerIntro: SETTINGS.ownerIntro || '',
  })
  console.log('  site settings')

  // ---- 4. Featured projects ----
  let pOrder = 0
  for (const p of PROJECTS) {
    pOrder += 1
    const image = p.image ? await uploadImage(p.image) : undefined
    await client.create({
      _type: 'featuredProject',
      title: p.title,
      category: p.category,
      tagline: p.tagline,
      order: pOrder,
      ...(image ? {image} : {}),
    })
    console.log('  project:', p.title)
  }

  // ---- 5. Team members (owners) ----
  let oOrder = 0
  for (const o of OWNERS) {
    oOrder += 1
    const photo = o.image ? await uploadImage(o.image) : undefined
    await client.create({
      _type: 'teamMember',
      name: o.name,
      role: o.role,
      bio: o.bio,
      stat: o.stat,
      order: oOrder,
      ...(photo ? {photo} : {}),
    })
    console.log('  owner:', o.name)
  }

  // ---- 6. Reviews ----
  let rOrder = 0
  for (const r of REVIEWS) {
    rOrder += 1
    await client.create({
      _type: 'review',
      name: r.name,
      initials: r.initials,
      quote: r.quote,
      roleLabel: r.roleLabel,
      googleUrl: r.googleUrl,
      order: rOrder,
    })
    console.log('  review:', r.name)
  }

  // ---- 7. Properties (linked to the city docs) ----
  let prOrder = 0
  for (const p of SEED) {
    prOrder += 1
    console.log('  property:', p.title, '...')
    const hero = p.hero ? await uploadImage(p.hero) : undefined
    const gallery = []
    let gi = 0
    for (const g of p.gallery || []) {
      try {
        const img = await uploadImage(g)
        gallery.push({...img, _key: 'gal' + gi})
        gi += 1
      } catch (e) {
        console.warn('    skipped a gallery image:', e.message)
      }
    }
    const cityId = cityIdBySlug[p.city]
    await client.create({
      _type: 'property',
      title: p.title,
      order: prOrder,
      tag: p.tag,
      ...(cityId ? {city: {_type: 'reference', _ref: cityId}} : {}),
      loc: p.loc,
      type: p.type,
      purpose: p.purpose,
      price: p.price,
      pmin: p.pmin,
      pmax: p.pmax,
      desc: p.desc,
      facts: (p.facts || []).map(([key, value], i) => ({_type: 'object', _key: 'fact' + i, key, value})),
      amen: p.amen || [],
      ...(hero ? {hero} : {}),
      ...(gallery.length ? {gallery} : {}),
    })
  }

  console.log('\nDone. Imported ' + citySlugs.length + ' cities, ' + PROJECTS.length + ' projects, ' +
    OWNERS.length + ' owners, ' + REVIEWS.length + ' reviews and ' + SEED.length + ' properties.')
  console.log('Open the Studio to see everything.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

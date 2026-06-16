// One-off: seed the existing Services cards so the client starts with them.
// Run:  npx sanity exec seed-services.mjs --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const services = [
  {title: 'Finance', description: 'Find and secure the right finance option with verified, honest guidance.', icon: 'home', order: 1},
  {title: 'Residential Selling', description: 'Price it right, present it well, reach genuine buyers faster.', icon: 'house', order: 2},
  {title: 'Site Branding', description: 'Our site branding initiatives create a lasting impression, making your property a landmark in its own right.', icon: 'briefcase', order: 3},
  {title: 'Commercial Properties', description: 'Shops, offices and retail in high-footfall locations.', icon: 'buildings', order: 4},
  {title: 'Investment Consulting', description: 'Data-led advice on appreciation and rental yield.', icon: 'chart', order: 5},
  {title: 'Property Evaluation', description: 'Accurate, locality-specific valuations you can trust.', icon: 'checklist', order: 6},
  {title: 'Market Guidance', description: 'Clear reads on trends, timing and growth corridors.', icon: 'search', order: 7},
  {title: 'Site Visits', description: 'Guided, no-pressure tours of shortlisted properties.', icon: 'pin', order: 8},
]

let tx = client.transaction()
services.forEach((s, i) => {
  tx = tx.createOrReplace({_id: 'service-' + (i + 1), _type: 'service', ...s})
})
const res = await tx.commit()
console.log('Seeded', res.results.length, 'services ✓')

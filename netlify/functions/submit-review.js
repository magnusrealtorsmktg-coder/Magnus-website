/**
 * Netlify serverless function — receives a visitor's review from the website
 * and writes it into Sanity as an UNPUBLISHED DRAFT.
 *
 * The Sanity token lives ONLY here, read from the SANITY_REVIEW_TOKEN
 * environment variable (set in Netlify → Site settings → Environment
 * variables). It is never sent to the browser, so it cannot be stolen from
 * the page source — this is what makes the feature safe.
 *
 * Because the review is created as a draft (`drafts.*`), it stays hidden on
 * the public site until your client opens the Studio and clicks Publish.
 * They can also just Delete it there. No code changes are ever needed.
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID || '93f80h7a';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || 'v2024-01-01';

const reply = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

function randomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 16; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Method not allowed' });

  const token = process.env.SANITY_REVIEW_TOKEN;
  if (!token) {
    console.error('SANITY_REVIEW_TOKEN environment variable is not set');
    return reply(500, { error: 'Server not configured' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return reply(400, { error: 'Invalid request' });
  }

  // Honeypot: humans leave this empty; bots fill every field. If it has a
  // value, return success so the bot moves on, but write nothing to Sanity.
  if (data.company && String(data.company).trim() !== '') {
    return reply(200, { success: true });
  }

  const name = (data.name || '').toString().trim();
  const quote = (data.quote || '').toString().trim();

  if (!name || !quote) return reply(400, { error: 'Name and review are required' });
  if (name.length > 80 || quote.length > 600) return reply(400, { error: 'Input too long' });

  // rating: clamp to a 1–5 integer, default 5
  let rating = parseInt(data.rating, 10);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) rating = 5;

  const doc = {
    _id: 'drafts.' + randomId(), // draft → hidden on the site until published in the Studio
    _type: 'review',
    name,
    quote,
    rating,
  };

  const url = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/mutate/${DATASET}`;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: [{ create: doc }] }),
    });
    const result = await resp.json();
    if (!resp.ok || result.error) {
      console.error('Sanity mutate failed', result);
      return reply(502, { error: 'Could not save review' });
    }
    return reply(200, { success: true });
  } catch (err) {
    console.error('Sanity request error', err);
    return reply(502, { error: 'Upstream error' });
  }
};

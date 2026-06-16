// Social-share preview helper.
// The full index.html is large (~900 KB), and on-device crawlers like WhatsApp
// often fail to fetch/parse it — so link previews break. This edge function
// detects SHARE crawlers (WhatsApp, Facebook, Twitter, LinkedIn, Telegram, etc.)
// and returns a tiny HTML containing only the Open Graph tags, which they parse
// instantly. Real users AND search engines (Google/Bing) get the real page,
// so SEO and the site are unaffected.

const SHARE_CRAWLER = /whatsapp|facebookexternalhit|facebot|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|pinterest|redditbot|skypeuripreview|embedly|vkshare|tumblr|bitlybot|flipboard|nuzzel|qwantify|outbrain|applebot|developers\.google\.com\/\+\/web\/snippet/i;

const OG_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Magnus Realtors® — Real Estate Guidance Built on Trust</title>
<meta name="description" content="Magnus Realtors — premium real estate consultancy in Virar West. Residential & commercial buying, selling, rentals and investment guidance across Virar, Global City & Vasai.">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Magnus Realtors">
<meta property="og:title" content="Magnus Realtors® — Real Estate Guidance Built on Trust">
<meta property="og:description" content="Premium real estate consultancy in Virar West — residential & commercial buying, selling, rentals and investment across Virar, Global City & Vasai.">
<meta property="og:url" content="https://magnusrealtor.in/">
<meta property="og:image" content="https://magnusrealtor.in/og-image.jpg">
<meta property="og:image:secure_url" content="https://magnusrealtor.in/og-image.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Magnus Realtors logo">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Magnus Realtors® — Real Estate Guidance Built on Trust">
<meta name="twitter:description" content="Premium real estate consultancy in Virar West — residential & commercial buying, selling, rentals and investment across Virar, Global City & Vasai.">
<meta name="twitter:image" content="https://magnusrealtor.in/og-image.jpg">
</head>
<body>Magnus Realtors® — Real Estate Guidance Built on Trust</body>
</html>`;

export default async (request, context) => {
  try {
    const ua = request.headers.get('user-agent') || '';
    if (SHARE_CRAWLER.test(ua)) {
      return new Response(OG_HTML, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, max-age=300',
        },
      });
    }
  } catch (e) {
    // fall through to the real page on any error
  }
  return context.next();
};

export const config = { path: '/' };

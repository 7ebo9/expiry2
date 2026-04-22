exports.handler = async function(event) {
  try {
    const { domain, token, path, method = 'GET', body } = JSON.parse(event.body);

    const url = 'https://' + domain + '/admin/api/2024-01' + path;

    const options = {
      method,
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      }
    };

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    const data = await res.json();

    const link = res.headers.get('Link');
    const next = link && link.match(/<([^>]+)>;\s*rel="next"/);
    if (next) {
      const nextUrl = new URL(next[1]);
      data.nextPath = nextUrl.pathname.replace('/admin/api/2024-01', '') + nextUrl.search;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};

exports.handler = async function(event, context) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  const { page = 1, query = 'random' } = event.queryStringParameters;

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}&per_page=20`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

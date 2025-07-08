const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

export default async function handler(req, res) {
  const token = req.headers["x-replicate-api-token"];
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ detail: "Missing Replicate API token. Please provide your token in the x-replicate-api-token header." }));
    return;
  }
  const response = await fetch(`${API_HOST}/v1/predictions/${req.query.id}`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.end(JSON.stringify(prediction));
}

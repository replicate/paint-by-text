import Replicate from "replicate";
import packageData from "../../../package.json";

const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

export default async function handler(req, res) {
  const token = req.headers["x-replicate-api-token"];
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ detail: "Missing Replicate API token. Please provide your token in the x-replicate-api-token header." }));
    return;
  }
  // remove null and undefined values
  req.body = Object.entries(req.body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );
  let prediction;
  const model = "black-forest-labs/flux-kontext-pro";
  const replicate = new Replicate({
    auth: token,
    userAgent: `${packageData.name}/${packageData.version}`
  });
  prediction = await replicate.predictions.create({
    model,
    input: req.body
  });
  console.log({ prediction });
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

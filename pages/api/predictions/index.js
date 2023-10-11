import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: `${packageData.name}/${packageData.version}`
});



const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

import packageData from "../../../package.json";

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.");
  }
  
  // remove null and undefined values
  req.body = Object.entries(req.body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );

  let prediction
  if (process.env.USE_REPLICATE_DEPLOYMENT) {
    console.log("Using deployment")
    prediction = await replicate.deployments.predictions.create(
      "replicate",
      "paint-by-text",
      {
        input: req.body
      }
    );
  } else {
    console.log("Not using deployment")
    // https://replicate.com/timothybrooks/instruct-pix2pix/versions
    const version = "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f"
    prediction = await replicate.predictions.create({
      version, 
      input: req.body
    });
  }

  console.log({prediction});

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

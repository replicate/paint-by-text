# 👩‍🎨 Paint with words

A web GUI for running InstructPix2Pix using Replicate's API.

Try it out at [paintwithwords.app](https://paintwithwords.app)

See also:

- Replicate model: https://replicate.com/cjwbw/instruct-pix2pix-diffuser
- Owner's project page: https://www.timothybrooks.com/instruct-pix2pix
- Owner's model repository: https://github.com/timothybrooks/instruct-pix2pix

## How it works

🐢🚀 This is a Node.js app! It's powered by:

- [Replicate](https://replicate.com/), a platform for running machine learning models in the cloud.
- [InstructPix2Pix](https://replicate.com/cjwbw/instruct-pix2pix-diffuser/api), an open-source machine learning model that generates images from an image and a text prompt.
- Next.js [server-side API routes](pages/api) for talking to the Replicate API
- Next.js React components for the inpainting GUI
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for Icons

## Development

Prerequisites:

1. Recent version of Node.js
2. [Replicate API token](https://replicate.com/account)

Set your Replicate API token in your environment:

```
REPLICATE_API_TOKEN=<your-token-here>
```

Then install dependencies and run the server:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Dropzone from "components/dropzone";
import Download from "components/download";
import { XCircle as StartOverIcon } from "lucide-react";
import { Code as CodeIcon } from "lucide-react";
import { Rocket as RocketIcon } from "lucide-react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

import { getRandomSeed } from "lib/seeds";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seed] = useState(getRandomSeed());

  // set the initial image from a random seed
  useEffect(() => {
    setEvents([{ image: seed.image }]);
  }, []);

  const handleImageDropped = async (image) => {
    try {
      image = await prepareImageFileForUpload(image);
    } catch (error) {
      setError(error.message);
      return;
    }
    setEvents(events.concat([{ image }]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = e.target.prompt.value;
    const lastImage = events.findLast((ev) => ev.image)?.image;

    setError(null);
    setIsProcessing(true);

    // make a copy so that the second call to setEvents here doesn't blow away the first. Why?
    const myEvents = [...events, { prompt }];
    setEvents(myEvents);

    const body = {
      prompt,
      image: lastImage,
    };

    // console.log("submitting", { body });

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const prediction = await response.json();

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }

      // just for bookkeeping
      setPredictions(predictions.concat([prediction]));
      // console.log(predictions);

      if (prediction.status === "succeeded") {
        setEvents(
          myEvents.concat([
            { image: prediction.output?.[prediction.output.length - 1] },
          ])
        );
      }
    }

    setIsProcessing(false);
  };

  const startOver = async (e) => {
    e.preventDefault();
    setEvents([]);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div>
      <Head>
        <title>Paint with words</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className="container max-w-[700px] mx-auto p-5">
        <h1 className="text-center text-5xl font-bold m-6">
          {/* <div className="mb-10">🖌️</div> */}
          Paint with words
        </h1>

        <h1 className="text-center text-xl opacity-60 m-6">
          Use generative AI to manipulate images with text prompts.
        </h1>

        <Canvas events={events} isProcessing={isProcessing} />

        <PromptForm
          onSubmit={handleSubmit}
          disabled={isProcessing}
          seed={seed}
        />

        <Dropzone onImageDropped={handleImageDropped} />

        <div className="mx-auto w-full">
          {error && <p className="bold text-red-500 pb-5">{error}</p>}
        </div>
      </main>
    </div>
  );
}

function prepareImageFileForUpload(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = (e) => {
      const img = document.createElement("img");
      img.onload = function () {
        const MAX_WIDTH = 512;
        const MAX_HEIGHT = 512;

        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            width = MAX_WIDTH;
            height = height * (MAX_WIDTH / width);
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0, width, height);

        const dataURL = canvas.toDataURL(file.type);

        resolve(dataURL);
      };
      img.src = e.target.result;
    };
    fr.readAsDataURL(file);
  });
}

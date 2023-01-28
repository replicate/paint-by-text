import { useEffect, useState } from "react";
import Head from "next/head";
import Messages from "components/messages";
import PromptForm from "components/prompt-form";

import Footer from "components/footer";

import prepareImageFileForUpload from "lib/prepare-image-file-for-upload";
import { getRandomSeed } from "lib/seeds";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    setEvents(events.slice(0, 1));
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div>
      <Head>
        <title>Paint with words</title>
      </Head>

      <main className="container max-w-[700px] mx-auto p-5">
        <h1 className="text-center text-5xl font-bold m-6">Paint with words</h1>

        <h2 className="text-center text-xl opacity-60 m-6">
          Use generative AI to manipulate images with text prompts.
        </h2>

        <Messages events={events} isProcessing={isProcessing} />

        <PromptForm
          onSubmit={handleSubmit}
          disabled={isProcessing}
          seed={seed}
        />

        <div className="mx-auto w-full">
          {error && <p className="bold text-red-500 pb-5">{error}</p>}
        </div>

        <Footer
          events={events}
          startOver={startOver}
          handleImageDropped={handleImageDropped}
        />
      </main>
    </div>
  );
}

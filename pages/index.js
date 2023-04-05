import Messages from "components/messages";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useEffect, useState } from "react";

import Footer from "components/footer";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const appName = "Paint by Text";
export const appSubtitle =
  "Edit your photos using written instructions, with the help of an AI.";
export const appMetaDescription =
  "Edit your photos using written instructions, with the help of an AI.";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState(
    "https://www.youtube.com/watch?v=772WncdxCSw"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = e.target.prompt.value;

    setError(null);
    setIsProcessing(true);
    setInitialPrompt("");

    const myEvents = [...events, { prompt }];
    setEvents(myEvents);

    const body = {
      prompt,
    };

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const prediction = await response.json();

    if (response.status >= 400) {
      setError(prediction.error);
      return;
    }

    // just for bookkeeping
    setPredictions(predictions.concat([prediction]));

    if (prediction.status === "succeeded") {
      console.log({ prediction });
    }

    setIsProcessing(false);
  };

  const startOver = async (e) => {
    e.preventDefault();
    setEvents(events.slice(0, 1));
    setError(null);
    setIsProcessing(false);
    setInitialPrompt(seed.prompt);
  };

  return (
    <div>
      <Head>
        <title>{appName}</title>
        <meta name="description" content={appMetaDescription} />
        <meta property="og:title" content={appName} />
        <meta property="og:description" content={appMetaDescription} />
        <meta
          property="og:image"
          content="https://paintbytext.chat/opengraph.jpg"
        />
      </Head>

      <main className="container max-w-[700px] mx-auto p-5">
        <hgroup>
          <h1 className="text-center text-5xl font-bold m-6">{appName}</h1>
          <p className="text-center text-xl opacity-60 m-6">{appSubtitle}</p>
        </hgroup>

        <Messages
          events={events}
          isProcessing={isProcessing}
          onUndo={(index) => {
            setInitialPrompt(events[index - 1].prompt);
            setEvents(
              events.slice(0, index - 1).concat(events.slice(index + 1))
            );
          }}
        />

        <PromptForm
          initialPrompt={initialPrompt}
          isFirstPrompt={events.length === 1}
          onSubmit={handleSubmit}
          disabled={isProcessing}
        />

        <div className="mx-auto w-full">
          {error && <p className="bold text-red-500 pb-5">{error}</p>}
        </div>

        <Footer events={events} startOver={startOver} />
      </main>
    </div>
  );
}

import Messages from "components/messages";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useEffect, useState } from "react";

import Footer from "components/footer";

export const appName = "Ask a YouTube Video";
export const appSubtitle =
  "Ask ChatGPT questions about a specific YouTube Video.";
export const appMetaDescription =
  "Ask ChatGPT questions about a specific YouTube Video.";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = e.target.prompt.value;
    const url = e.target.url.value;

    setError(null);
    setIsProcessing(true);

    const myEvents = [...events, { prompt }];
    setEvents(myEvents);

    const body = {
      prompt,
      url,
    };

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status >= 400) {
      setError("There was an error fetching the answer");
    }
    if (response.status == 200) {
      const { response: answer } = await response.json();
      setEvents([...myEvents, { answer }]);
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
            setEvents(
              events.slice(0, index - 1).concat(events.slice(index + 1))
            );
          }}
        />

        <PromptForm
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

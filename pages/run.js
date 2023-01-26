import Canvas from "components/canvas";
import Download from "components/download";
import Dropzone from "components/dropzone";
import PromptForm from "components/prompt-form";
import useInterval from "hooks/use-interval";
import {
  Code as CodeIcon,
  Rocket as RocketIcon,
  XCircle as StartOverIcon,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!userUploadedImage) {
      setError("Please upload an image and try again.");
      return;
    }

    setWasSubmitted(true);

    let image;

    try {
      image = await readAsDataURL(userUploadedImage);
    } catch (error) {
      setError(error.message);
      return;
    }

    const body = {
      prompt: e.target.prompt.value,
      image,
    };

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

    setPredictions(predictions.concat([prediction]));
  };

  useInterval(async () => {
    const lastPrediction = predictions[predictions.length - 1];

    if (!lastPrediction) {
      return;
    }

    if (
      lastPrediction.status !== "succeeded" &&
      lastPrediction.status !== "failed"
    ) {
      const response = await fetch("/api/predictions/" + lastPrediction.id);
      const nextPrediction = await response.json();

      if (response.status !== 200) {
        setError(nextPrediction.detail);
        return;
      }

      setPredictions(predictions.concat([nextPrediction]));

      if (nextPrediction.status === "succeeded") {
        setUserUploadedImage(null);
      }
    }
  }, 1000);

  const startOver = async (e) => {
    e.preventDefault();
    setPredictions([]);
    setError(null);
    setMaskImage(null);
    setUserUploadedImage(null);
    setWasSubmitted(false);
  };

  return (
    <div>
      <Head>
        <title>InstructPix2Pix via Replicate&apos;s API</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className="container mx-auto p-5">
        <div className="border-hairline mx-auto relative">
          <Dropzone
            onImageDropped={setUserUploadedImage}
            predictions={predictions}
            userUploadedImage={userUploadedImage}
          />
          <div
            className="bg-gray-50 relative max-h-[512px] w-full flex items-stretch"
            // style={{ height: 0, paddingBottom: "100%" }}
          >
            <Canvas
              predictions={predictions}
              userUploadedImage={userUploadedImage}
              onDraw={setMaskImage}
            />
          </div>
        </div>

        <div className="max-w-[512px] mx-auto">
          <PromptForm onSubmit={handleSubmit} disabled={wasSubmitted} />

          {error && <p className="bold text-red-500 pb-5">{error}</p>}

          <div className="text-center">
            {((predictions.length > 0 &&
              predictions[predictions.length - 1].output) ||
              maskImage ||
              userUploadedImage) && (
              <button className="lil-button" onClick={startOver}>
                <StartOverIcon className="icon" />
                Start over
              </button>
            )}

            <Download predictions={predictions} />
            <Link href="https://replicate.com/cjwbw/instruct-pix2pix-diffuser/api">
              <a target="_blank" className="lil-button">
                <RocketIcon className="icon" />
                Powered by Replicate
              </a>
            </Link>
            <Link href="https://github.com/replicate/instruct-pix2pix-demo">
              <a
                className="lil-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CodeIcon className="icon" />
                Fork on GitHub
              </a>
            </Link>
            <Link href="https://replicate.com/cjwbw/instruct-pix2pix/examples">
              <a
                className="lil-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CodeIcon className="icon" />
                View more examples
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function readAsDataURL(file) {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(
      "File must not be larger than 10 MB in size. Please resize it and try again."
    );
  }

  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}

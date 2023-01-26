import { useState } from "react";
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
      image = await prepareImageFileForUpload(userUploadedImage);
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

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        setUserUploadedImage(null);
      }
    }
  };

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

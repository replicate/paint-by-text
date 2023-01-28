import React from "react";
import { Download as DownloadIcon } from "lucide-react";
import Dropzone from "components/dropzone";
import { XCircle as StartOverIcon } from "lucide-react";
import { Code as CodeIcon } from "lucide-react";
import { Rocket as RocketIcon } from "lucide-react";
import Link from "next/link";

export default function Footer({ events, startOver, handleImageDropped }) {
  return (
    <div className="w-full">
      -{" "}
      <div className="text-center">
        {events.length > 1 && (
          <button className="lil-button" onClick={startOver}>
            <StartOverIcon className="icon" />
            Start over
          </button>
        )}

        <Dropzone onImageDropped={handleImageDropped} />

        {events.length > 1 && (
          <Link href={events.findLast((ev) => ev.image).image}>
            <a className="lil-button" target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="icon" />
              Download image
            </a>
          </Link>
        )}

        <Link href="https://github.com/replicate/instruct-pix2pix-demo">
          <a className="lil-button" target="_blank" rel="noopener noreferrer">
            <CodeIcon className="icon" />
            Fork repo
          </a>
        </Link>
      </div>
      <div className="text-center lil-text mt-10 mb-10">
        Powered by{" "}
        <Link href="https://replicate.com/cjwbw/instruct-pix2pix-diffuser/api">
          <a target="_blank">Replicate</a>
        </Link>
        {", "}
        <Link href="https://vercel.com/templates/ai">
          <a target="_blank">Vercel</a>
        </Link>
        {", and "}
        <Link href="https://github.com/replicate/instruct-pix2pix-demo">
          <a target="_blank">GitHub</a>
        </Link>
      </div>
    </div>
  );
}

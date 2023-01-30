import Dropzone from "components/dropzone";
import {
  Code as CodeIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  XCircle as StartOverIcon,
} from "lucide-react";
import Link from "next/link";

export default function Footer({ events, startOver, handleImageDropped }) {
  return (
    <footer className="w-full my-8">
      <div className="text-center">
        <Link href="/about">
          <a className="lil-button">
            <InfoIcon className="icon" />
            What is this?
          </a>
        </Link>

        {events.length > 1 && (
          <button className="lil-button" onClick={startOver}>
            <StartOverIcon className="icon" />
            Start over
          </button>
        )}

        <Dropzone onImageDropped={handleImageDropped} />

        {events.length > 2 && (
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
      <div className="text-center lil-text mt-8">
        Powered by{" "}
        <Link href="https://www.timothybrooks.com/instruct-pix2pix/">
          <a target="_blank">InstructPix2Pix</a>
        </Link>
        ,{" "}
        <Link href="https://replicate.com/cjwbw/instruct-pix2pix-diffuser/api">
          <a target="_blank">Replicate</a>
        </Link>
        ,{" "}
        <Link href="https://vercel.com/templates/ai">
          <a target="_blank">Vercel</a>
        </Link>
        , and{" "}
        <Link href="https://github.com/replicate/instruct-pix2pix-demo">
          <a target="_blank">GitHub</a>
        </Link>
      </div>
    </footer>
  );
}

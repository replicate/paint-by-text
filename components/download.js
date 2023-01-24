import Link from "next/link";
import { Download as DownloadIcon } from "lucide-react";

export default function Download(props) {
  if (!props.predictions.length) return null;

  const lastPrediction = props.predictions[props.predictions.length - 1];

  if (!lastPrediction.output) return null;

  const lastImage = lastPrediction.output[lastPrediction.output.length - 1];

  return (
    <Link href={lastImage}>
      <a className="lil-button" target="_blank" rel="noopener noreferrer">
        <DownloadIcon className="icon" />
        Download
      </a>
    </Link>
  );
}

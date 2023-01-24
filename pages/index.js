import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import teaser from "../public/teaser.jpg";

export default function About() {
  return (
    <div className="max-w-[1024px] mx-auto p-10 bg-white rounded-lg">
      <Head>
        <title>InstructPix2Pix</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Link href="/run">
        <Image src={teaser} alt="teaser" />
      </Link>

      <p className="pb-5 pt-5 text-lg">
        <strong>InstructPix2Pix</strong> is an open-source machine learning
        model that takes an image and a written instruction as input, and
        generates a new image as ouput.
      </p>

      <Link href="/run">
        <a className="py-3 block text-center bg-black text-white rounded-md mt-10">
          Get started
        </a>
      </Link>
    </div>
  );
}

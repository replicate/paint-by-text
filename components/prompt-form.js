import PromptInput from "components/prompt-input";
import { useState } from "react";
import Message from "./message";

export default function PromptForm({
  isFirstPrompt,
  onSubmit,
  disabled = false,
}) {
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrompt("");
    onSubmit(e);
  };

  if (disabled) {
    return;
  }

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
      <Message sender="openai" isSameSender>
        <label htmlFor="prompt-input">
          {isFirstPrompt
            ? "Please Paste the URL to the YouTube video into the first input"
            : "What do you want to ask the video now?"}
        </label>
      </Message>

      <div className="flex mt-8">
        <PromptInput
          value={url}
          setValue={setUrl}
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=772WncdxCSw"
        />
      </div>
      <div className="flex mt-1">
        <PromptInput
          value={prompt}
          setValue={setPrompt}
          disabled={disabled}
          buttonText={"send"}
          name="prompt"
          placeholder="Your message"
        />
      </div>
    </form>
  );
}

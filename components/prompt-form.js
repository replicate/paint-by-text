import { useState } from "react";
import Message from "./message";

export default function PromptForm({ onSubmit, disabled = false, seed }) {
  const [prompt, setPrompt] = useState(seed.prompt);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrompt("");
    onSubmit(e);
  };

  if (disabled) {
    return;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-5 animate-in fade-in duration-700"
    >
      <Message sender="replicate" isSameSender>
        <label htmlFor="prompt-input">What should we change?</label>
      </Message>

      <div className="flex mt-8">
        <input
          id="prompt-input"
          type="text"
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Your message..."
          className={`block w-full flex-grow${
            disabled ? " rounded-md" : " rounded-l-md"
          }`}
          disabled={disabled}
        />

        {disabled || (
          <button
            className="bg-black text-white rounded-r-md text-small inline-block p-3 flex-none"
            type="submit"
          >
            Paint
          </button>
        )}
      </div>
    </form>
  );
}

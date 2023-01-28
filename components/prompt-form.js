import React, { useState } from "react";

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
      className="py-5 animate-in fade-in duration-700"
    >
      <div className="flex">
        <input
          type="text"
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type another message to make more changes..."
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

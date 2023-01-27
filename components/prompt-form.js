export default function PromptForm({ onSubmit, disabled = false }) {
  return (
    <form onSubmit={onSubmit} className="py-5 animate-in fade-in duration-700">
      <div className="flex max-w-[512px]">
        <input
          type="text"
          name="prompt"
          defaultValue={"add fireworks to the sky"}
          placeholder="Add an instruction to change the image..."
          className={`block w-full flex-grow${
            disabled ? " rounded-md" : " rounded-l-md"
          }`}
          disabled={disabled}
        />

        {disabled || (
          <button
            className="bg-black text-white rounded-r-md text-small inline-block px-3 flex-none"
            type="submit"
          >
            Go
          </button>
        )}
      </div>
    </form>
  );
}

export default function PromptInput({
  disabled,
  value,
  setValue,
  buttonText,
  name,
  placeholder,
  type = "text",
}) {
  return (
    <>
      <input
        id={`${name}-input`}
        type={type}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`block w-full flex-grow${
          disabled ? " rounded-md" : " rounded-l-md"
        }`}
        disabled={disabled}
      />

      {!disabled && buttonText && (
        <button
          className="bg-black text-white rounded-r-md text-small inline-block p-3 flex-none"
          type="submit"
        >
          {buttonText}
        </button>
      )}
    </>
  );
}

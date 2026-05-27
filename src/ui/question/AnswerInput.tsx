import { useState, type FormEvent } from "react";

type Props = {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
};

export function AnswerInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form className="ql-answer" onSubmit={handleSubmit}>
      <textarea
        className="ql-answer__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Think out loud…"
        rows={3}
        disabled={disabled}
        aria-label="Your answer"
      />
      <button type="submit" className="ql-answer__submit" disabled={disabled || !value.trim()}>
        Submit
      </button>
    </form>
  );
}

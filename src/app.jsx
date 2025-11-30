import { useState, useEffect } from "preact/hooks";
import "./app.css";

export function App() {
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [digits, setDigits] = useState([]);

  // Generate random date in DD.MM.YYYY
  const generateRandomDate = () => {
    const start = new Date(2000, 0, 1).getTime();
    const end = new Date(2030, 11, 31).getTime();
    const rnd = new Date(start + Math.random() * (end - start));
    const dd = String(rnd.getDate()).padStart(2, "0");
    const mm = String(rnd.getMonth() + 1).padStart(2, "0");
    const yyyy = rnd.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const shuffleDigits = () => {
    const arr = Array.from({ length: 10 }, (_, i) => i.toString());
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setDigits(arr);
  };

  const reset = () => {
    setTarget(generateRandomDate());
    setInput("");
    setMessage("");
    shuffleDigits();
  };

  useEffect(() => {
    reset();
  }, []);

  const targetDigitsOnly = () => target.replace(/\D/g, "");

  const formatInputWithDots = (rawInput) => {
    const template = target;
    if (!template) return rawInput;

    let res = "";
    let idx = 0;

    for (let i = 0; i < template.length; i++) {
      if (/\d/.test(template[i])) {
        res += rawInput[idx] ?? "_";
        idx++;
      } else {
        res += template[i];
      }
    }
    return res;
  };

  const onDigitClick = (d) => {
    const digitsOnly = targetDigitsOnly();
    if (input.length >= digitsOnly.length) return;
    const newInput = input + d;
    setInput(newInput);

    if (newInput.length === digitsOnly.length) {
      if (newInput === digitsOnly)
        setMessage("✅ Правильно! Отличная скорость!");
      else setMessage("❌ Ошибка! Попробуй ещё.");
    } else {
      setMessage("");
    }
  };

  const undoLast = () => {
    if (input.length > 0) setInput(input.slice(0, -1));
    setMessage("");
  };

  return (
    <div class="container">
      <h1>Captcha</h1>

      <div class="label">
        Tarixi yazin: <b>{target}</b>
      </div>

      <div class="digits-grid">
        {digits.map((d) => (
          <button key={d} onClick={() => onDigitClick(d)} class="digit-btn">
            {d}
          </button>
        ))}
      </div>

      <div class="input-preview">{formatInputWithDots(input)}</div>

      <div class="message">{message}</div>

      <div class="buttons">
        <button onClick={reset} class="btn main">
          Обновить
        </button>
        <button onClick={undoLast} class="btn">
          Отменить
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "preact/hooks";
import "./app.css";

export function App() {
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [digits, setDigits] = useState([]);

  const [elapsed, setElapsed] = useState(0);        // ⏱ время
  const [timerRunning, setTimerRunning] = useState(false); // работает ли таймер

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
    setElapsed(0);
    setTimerRunning(false);
  };

  useEffect(() => {
    reset();
  }, []);

  // ⏱ Реальный секундомер (100 раз в секунду)
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsed((t) => t + 0.01);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

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

    // стартуем таймер на первом клике
    if (input.length === 0) {
      setTimerRunning(true);
      setElapsed(0);
    }

    if (input.length >= digitsOnly.length) return;

    const newInput = input + d;
    setInput(newInput);

    // Если закончили ввод
    if (newInput.length === digitsOnly.length) {
      setTimerRunning(false); // стоп!

      const time = elapsed.toFixed(2);

      if (newInput === digitsOnly) {
        setMessage(`✅ Верно! Время: ${time} сек`);
      } else {
        setMessage(`❌ Ошибка! Время: ${time} сек`);
      }
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

      <div class="timer">⏱ {elapsed.toFixed(2)} сек</div>

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
          Refresh
        </button>
        <button onClick={undoLast} class="btn"> Delete </button>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Text-to-speech methods</h1>
      <div className="flex column">
        <button onClick={() => navigate("/builtIn")}>
          Built-in JavaScript
        </button>
        <button onClick={() => navigate("/EasySpeech")}>
          JavaScript with Easy Speech library
        </button>
        <button onClick={() => navigate("/Paid")}>Paid Services</button>
      </div>
      <h1>Speech-to-text</h1>
      <button onClick={() => navigate("/RSR")}>Paid Services</button>
    </>
  );
}

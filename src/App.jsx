import { Route, Routes } from "react-router-dom";
import "./App.css";
import Alan from "./components/Voice Assistant/Alan";
import BuiltIn from "./components/TTS/BuiltIn";
import EasySpeechLibrary from "./components/TTS/EasySpeechLibrary";
import Home from "./components/Home";
import Paid from "./components/TTS/Paid";
import RSR from "./components/Voice Assistant/RSR";
import BoxContextWrapper from "./components/Voice Assistant/BoxContext";

export default function App() {
  return (
    <BoxContextWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builtIn" element={<BuiltIn />} />
        <Route path="/easySpeech" element={<EasySpeechLibrary />} />
        <Route path="/Paid" element={<Paid />} />
        <Route path="/RSR" element={<RSR />} />
        <Route path="/Alan" element={<Alan />} />
      </Routes>
    </BoxContextWrapper>
  );
}

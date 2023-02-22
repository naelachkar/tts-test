import alanBtn from "@alan-ai/alan-sdk-web";
import { useCallback, useEffect, useState } from "react";
import { useBoxContext } from "../Voice Assistant/BoxContext";

const COMMANDS = {
  OPEN_BOX: "open-box",
  CLOSE_BOX: "close-box",
  CHANGE_BACKGROUND: "change-background",
};

export default function useAlan() {
  const [alanInstance, setAlanInstance] = useState();
  const { bool, setBool, backgroundColor, setBackgroundColor } =
    useBoxContext();

  const openBox = useCallback(() => {
    if (!bool) {
      alanInstance.playText("Box already open");
    } else {
      alanInstance.playText("Opening the box");
      setBool(false);
    }
  }, [alanInstance, bool, setBool]);

  const closeBox = useCallback(() => {
    if (bool) {
      alanInstance.playText("Box already closed");
    } else {
      alanInstance.playText("Closing the box");
      setBool(true);
    }
  }, [alanInstance, bool, setBool]);

  const changeBackground = useCallback(
    ({ detail: { color } }) => {
      alanInstance.playText(`Changing the background color to ${color}`);
      setBackgroundColor(`${color}`);
    },
    [alanInstance, backgroundColor, setBackgroundColor]
  );

  useEffect(() => {
    window.addEventListener(COMMANDS.OPEN_BOX, openBox);
    window.addEventListener(COMMANDS.CLOSE_BOX, closeBox);
    window.addEventListener(COMMANDS.CHANGE_BACKGROUND, changeBackground);

    return () => {
      window.removeEventListener(COMMANDS.OPEN_BOX, openBox);
      window.removeEventListener(COMMANDS.CLOSE_BOX, closeBox);
      window.removeEventListener(COMMANDS.CHANGE_BACKGROUND, changeBackground);
    };
  }, [openBox, closeBox, changeBackground]);

  useEffect(() => {
    if (alanInstance != null) return;
    setAlanInstance(
      alanBtn({
        top: "20px",
        left: "20px",
        key: import.meta.env.VITE_ALAN_KEY,
        onCommand: ({ command, payload }) => {
          window.dispatchEvent(new CustomEvent(command, { detail: payload }));
        },
      })
    );
  }, []);

  return null;
}

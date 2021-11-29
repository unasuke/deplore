import { atom } from "recoil";

export const translateState = atom({
  key: "translateState",
  default: {
    originalText: "",
    originalTextLanguage: "EN",
    translatedText: "",
    translatedTextLanguage: "EN-US",
  },
});

import { atom } from "recoil";

export const translateState = atom({
  key: "translateState",
  default: {
    originalText: "",
    originalTextLanguage: "EN",
    digest: "",
    translatedText: "",
    translatedTextLanguage: "EN-US",
    translating: false,
  },
});

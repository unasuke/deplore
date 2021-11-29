import { atom } from "recoil";

export const settingState = atom({
  key: "settingState",
  default: {
    open: false,
    api_key: "",
    plan: "free",
    target_language: "EN-US",
  },
});

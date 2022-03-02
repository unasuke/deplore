import { emit } from "@tauri-apps/api/event";
import { translateStateToJSON } from "../util/state";

export function callTauri(state: {
  originalText: string;
  originalTextLanguage: string;
  translatedTextLanguage: string;
  digest: string;
}) {
  try {
    emit("translate-request", translateStateToJSON(state));
  } catch (e) {
    console.trace(e);
  }
}

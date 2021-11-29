import { LanguageSelectMenu } from "./LanguageSelectMenu";
import { useRecoilState } from "recoil";
import { translateState } from "../atoms/translateState";
import { debounce } from "mabiki";
import { emit } from "@tauri-apps/api/event";
import { translateStateToJSON } from "../util/state";

function callTauri(state: {
  originalText: string;
  originalTextLanguage: string;
  translatedTextLanguage: string;
}) {
  try {
    emit("translate-request", translateStateToJSON(state));
  } catch (e) {
    console.trace(e);
  }
}

export function OriginalText() {
  const [translate, setTranslate] = useRecoilState(translateState);
  const onChange = debounce((event) => {
    callTauri({ ...translate, originalText: event.target.value });
    setTranslate({
      ...translate,
      originalText: event.target.value,
    });
  }, 500);
  return (
    <div class="flex-1 max-w-7xl sm:mx-auto px-2 sm:pl-6 sm:pr-3 lg:pl-8 lg:pr-4 flex flex-col">
      <div class="py-2 flex flex-row content-center items-center">
        <label class="block text-lg font-medium text-gray-700 mr-3 truncate">
          Original text
        </label>
        <div class="flex-grow">
          <LanguageSelectMenu langType="original" />
        </div>
      </div>
      <div class="flex-grow pb-2 sm:pb-6 lg:pb-8">
        <textarea
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-base border-gray-300 rounded-md h-full p-1"
          onChange={onChange}
        ></textarea>
      </div>
    </div>
  );
}

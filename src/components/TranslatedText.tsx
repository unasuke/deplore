import { LanguageSelectMenu } from "./LanguageSelectMenu";
import { useRecoilState } from "recoil";
import { translateState } from "../atoms/translateState";
import { settingState } from "../atoms/settingState";
import { useEffect } from "preact/hooks";
import { once } from "@tauri-apps/api/event";
import { CogIcon } from "@heroicons/react/solid";

export function TranslatedText() {
  const [translate, setTranslate] = useRecoilState(translateState);
  const [setting, setSettingState] = useRecoilState(settingState);
  console.info("render-translate", translate);
  console.info(setting);
  const openSettingModal = () => {
    setSettingState({ ...setting, open: true });
  };
  useEffect(() => {
    console.info("effect-translate", translate);
    const unlisten = once(
      "translate-callback",
      (event: { event: string; payload: string }) => {
        console.info("translate", translate);
        const resp = JSON.parse(event.payload);
        console.info(resp);
        if (resp.digest === translate.digest) {
          setTranslate({ ...translate, translatedText: resp.translated_text });
        }
      }
    );
    return () => {
      console.info("unlisten-translate");
      unlisten.then((unlisten) => unlisten());
    };
  }, [translate]);
  return (
    <div class="flex-1 max-w-7xl sm:mx-auto px-2 sm:pr-6 sm:pl-3 lg:pr-8 lg:pl-4 flex flex-col">
      <div class="py-2 flex flex-row content-center items-center">
        <label class="block text-lg font-medium text-gray-700 mr-3 truncate">
          Translated text
        </label>
        <div class="flex-grow">
          <LanguageSelectMenu langType="translated" />
        </div>
        <div
          class="mt-1"
          onClick={() => {
            setSettingState({ ...setting, open: true });
          }}
        >
          <CogIcon className="h-9 w-9 text-gray-700 cursor-pointer ml-2" />
        </div>
      </div>
      <div class="flex-grow pb-2 sm:pb-6 lg:pb-8">
        <textarea
          class="shadow-sm focus:ring-indigo-499 focus:border-indigo-500 block w-full sm:text-base border-gray-300 rounded-md h-full p-1 sm:leading-relaxed"
          value={translate.translatedText}
        ></textarea>
      </div>
    </div>
  );
}

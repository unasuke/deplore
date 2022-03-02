import { LanguageSelectMenu } from "./LanguageSelectMenu";
import { useRecoilState } from "recoil";
import { translateState } from "../atoms/translateState";
import { debounce } from "mabiki";
import { sha256 } from "../util/digest";
import { callTauri } from "../util/callTauri"

export function OriginalText() {
  const [translate, setTranslate] = useRecoilState(translateState);
  const onChange = debounce((event) => {
    sha256(event.target.value).then((hash) => {
      callTauri({
        ...translate,
        originalText: event.target.value,
        digest: hash,
      });
      setTranslate({
        ...translate,
        originalText: event.target.value,
        translating: true,
        digest: hash,
      });
    });
  }, 3000);
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
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-base border-gray-300 rounded-md h-full p-1 sm:leading-relaxed"
          onChange={onChange}
        ></textarea>
      </div>
    </div>
  );
}

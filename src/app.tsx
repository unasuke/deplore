import "tailwindcss/tailwind.css";
import { OriginalText } from "./components/OriginalText";
import { TranslatedText } from "./components/TranslatedText";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { SettingModal } from "./components/SettingModal";

export function App() {
  return (
    <RecoilRoot>
      <div class="h-full bg-gray-300">
        <div class="flex flex-col sm:flex-row h-full">
          <OriginalText />
          <TranslatedText />
          <SettingModal />
        </div>
      </div>
    </RecoilRoot>
  );
}

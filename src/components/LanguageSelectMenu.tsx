import { Fragment } from "preact";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { SourceLanguages, TargetLanguages } from "../const/Languages";
import { useRecoilState } from "recoil";
import { translateState } from "../atoms/translateState";

type LanguageType = "original" | "translated";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function findLanguage(langType: LanguageType, code: string) {
  let list;
  if (langType === "original") {
    list = SourceLanguages;
  } else {
    list = TargetLanguages;
  }
  return list.find((l) => l.code === code);
}

function languageList(langType: LanguageType) {
  if (langType === "original") {
    return SourceLanguages;
  } else {
    return TargetLanguages;
  }
}

export function LanguageSelectMenu({ langType }: { langType: LanguageType }) {
  const [translate, setTranslate] = useRecoilState(translateState);
  const currentLanguage =
    langType === "original"
      ? translate.originalTextLanguage
      : translate.translatedTextLanguage;
  const selectedLanguage = findLanguage(langType, currentLanguage);
  function onChange(value: any) {
    const orig =
      langType === "original" ? value.code : translate.originalTextLanguage;
    const target =
      langType === "translated" ? value.code : translate.translatedTextLanguage;
    setTranslate({
      ...translate,
      originalTextLanguage: orig,
      translatedTextLanguage: target,
    });
  }

  return (
    <Listbox value={currentLanguage} onChange={onChange}>
      {({ open }: any) => (
        <>
          <div className="mt-1 relative">
            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="block truncate">{`${selectedLanguage?.name} (${selectedLanguage?.code})`}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {languageList(langType).map((lang) => (
                  <Listbox.Option
                    key={lang.code}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={lang}
                  >
                    {() => (
                      <>
                        <span
                          className={classNames(
                            lang.code === currentLanguage
                              ? "font-semibold"
                              : "font-normal",
                            "block truncate"
                          )}
                        >
                          {`${lang.name} (${lang.code})`}
                        </span>

                        {lang.code === currentLanguage ? (
                          <span
                            className={classNames(
                              lang.code !== currentLanguage
                                ? "text-white"
                                : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

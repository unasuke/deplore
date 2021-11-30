import { Fragment } from "preact";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { settingState } from "../atoms/settingState";
import { translateState } from "../atoms/translateState";
import { useEffect, useRef } from "preact/hooks";
import { emit, once } from "@tauri-apps/api/event";

const planList = [
  { id: "free", title: "Free" },
  { id: "pro", title: "Pro" },
];

export function SettingModal() {
  const [setting, setSetting] = useRecoilState(settingState);
  const [translate, setTranslate] = useRecoilState(translateState);
  const apikeyRef = useRef();
  const planRef = useRef(setting.plan);
  console.info("modal render", setting);
  useEffect(() => {
    console.info("get-setting", setting);
    emit("get-setting");
  }, []);
  useEffect(() => {
    const unlisten = once(
      "get-setting-callback",
      (event: { event: string; payload: string }) => {
        console.info("get-setting-callback", event);
        const payload = JSON.parse(event.payload);
        setSetting({ ...setting, ...payload, open: false });
        setTranslate({
          ...translate,
          translatedTextLanguage: payload.target_language,
        });
      }
    );
    return () => {
      console.info("unlisten-getconf");
      unlisten.then((unlisten) => unlisten());
    };
  }, [setting]);

  const onSettingChange = (setting) => {
    const nextSetting = { ...setting, api_key: apikeyRef.current.value };
    console.info("onSettingChange", nextSetting);
    emit("set-setting", JSON.stringify(nextSetting));
    setSetting(nextSetting);
    emit("get-setting");
  };
  const onPlanSelected = (event) => {
    setSetting({ ...setting, plan: event.target.value });
  };

  return (
    <Transition.Root show={setting.open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => onSettingChange({ ...setting, open: false })}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mt-2">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Setting
                  </Dialog.Title>
                  <div class="mb-4">
                    <label
                      htmlFor="api-key"
                      className="block text-sm font-medium text-gray-700"
                    >
                      API key
                    </label>
                    <div className="mt-1">
                      <input
                        id="api-key"
                        name="api-key"
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ref={apikeyRef}
                        value={setting.api_key}
                        spellcheck={false}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-base font-medium text-gray-700">
                      Plan
                    </label>
                    <fieldset className="mt-2">
                      <legend className="sr-only">Plan</legend>
                      <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        {planList.map((plan) => (
                          <div key={plan.id} className="flex items-center">
                            <input
                              id={plan.id}
                              name="plan"
                              type="radio"
                              defaultChecked={plan.id === setting.plan}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              value={plan.id}
                              onChange={onPlanSelected}
                            />
                            <label
                              htmlFor={plan.id}
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              {plan.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => onSettingChange({ ...setting, open: false })}
                >
                  Apply and close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

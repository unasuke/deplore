export function translateStateToJSON(state: {
  originalText: string;
  originalTextLanguage: string;
  translatedTextLanguage: string;
  digest: string;
}): string {
  return JSON.stringify({
    original_text: state.originalText,
    original_text_language: state.originalTextLanguage,
    translated_text_language: state.translatedTextLanguage,
    digest: state.digest,
  });
}

export function jsonToTranslateState(json: string) {
  const str = JSON.parse(json);
  return {
    originalText: str?.original_text,
    originalTextLanguage: str?.original_text_language,
    translatedText: str?.translated_text,
    translatedTextLanguage: str?.translated_text_language,
  };
}

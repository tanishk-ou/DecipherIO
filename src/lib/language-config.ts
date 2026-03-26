// src/lib/language-config.ts

/**
 * Language codes supported (English + Hindi configuration)
 */
export const SUPPORTED_LANGUAGES = ['en-US', 'hi-IN'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Language definitions
 */
export const LANGUAGE_CONFIG: Record<
  SupportedLanguage,
  {
    code: string;
    name: string;
    nativeName: string;
    tesseractCode: string;
    geminiFallbackCode: string;
  }
> = {
  'en-US': {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    tesseractCode: 'eng',
    geminiFallbackCode: 'en',
  },
  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    tesseractCode: 'hin',
    geminiFallbackCode: 'hi',
  },
};

/**
 * TTS Voice definitions for English and Hindi
 */
export const TTS_VOICES: Record<
  SupportedLanguage,
  Array<{
    voiceId: string;
    displayName: string;
    gender: 'male' | 'female';
  }>
> = {
  'en-US': [
    { voiceId: 'en-US-Journey-F', displayName: 'Journey (Female)', gender: 'female' },
    { voiceId: 'en-US-Journey-D', displayName: 'Journey (Male)', gender: 'male' },
    { voiceId: 'en-US-Studio-O', displayName: 'Studio (Female)', gender: 'female' },
    { voiceId: 'en-US-Studio-M', displayName: 'Studio (Male)', gender: 'male' },
  ],
  'hi-IN': [
    { voiceId: 'hi-IN-Standard-A', displayName: 'Hindi Standard A', gender: 'female' },
    { voiceId: 'hi-IN-Standard-B', displayName: 'Hindi Standard B', gender: 'male' },
    { voiceId: 'hi-IN-Standard-C', displayName: 'Hindi Standard C', gender: 'female' },
    { voiceId: 'hi-IN-Standard-D', displayName: 'Hindi Standard D', gender: 'male' },
  ],
};

export function getLanguageName(code: SupportedLanguage): string {
  return LANGUAGE_CONFIG[code]?.name || code;
}

export function getLanguageNativeName(code: SupportedLanguage): string {
  return LANGUAGE_CONFIG[code]?.nativeName || code;
}

export function getTesseractCode(code: SupportedLanguage): string {
  return LANGUAGE_CONFIG[code]?.tesseractCode || 'eng';
}

export function getGeminiFallbackCode(code: SupportedLanguage): string {
  return LANGUAGE_CONFIG[code]?.geminiFallbackCode || 'en';
}

export function getTTSVoices(code: SupportedLanguage) {
  return TTS_VOICES[code] || [];
}

export function getDefaultTTSVoice(code: SupportedLanguage): string {
  const voices = getTTSVoices(code);
  if (voices.length > 0) return voices[0].voiceId;
  
  // Safe fallbacks if the array is ever empty
  return code === 'hi-IN' ? 'hi-IN-Standard-A' : 'en-US-Journey-F';
}

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage);
}

// Set English as the default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Language } from "@/constants/translations";
import translations from "@/constants/translations";

type Settings = {
  language: Language;
  darkMode: boolean;
  ttsLanguage: string;
  ttsRate: number;
  ttsPitch: number;
};

type SettingsContextType = Settings & {
  setLanguage: (lang: Language) => void;
  setDarkMode: (dark: boolean) => void;
  setTtsLanguage: (lang: string) => void;
  setTtsRate: (rate: number) => void;
  setTtsPitch: (pitch: number) => void;
  t: typeof translations.fr;
};

const STORAGE_KEY = "@bible_settings";

const defaultSettings: Settings = {
  language: "fr",
  darkMode: false,
  ttsLanguage: "fr-FR",
  ttsRate: 1.0,
  ttsPitch: 1.0,
};

const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  setLanguage: () => {},
  setDarkMode: () => {},
  setTtsLanguage: () => {},
  setTtsRate: () => {},
  setTtsPitch: () => {},
  t: translations.fr,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val) as Partial<Settings>;
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setLanguage: (lang) => updateSettings({ language: lang }),
        setDarkMode: (dark) => updateSettings({ darkMode: dark }),
        setTtsLanguage: (lang) => updateSettings({ ttsLanguage: lang }),
        setTtsRate: (rate) => updateSettings({ ttsRate: rate }),
        setTtsPitch: (pitch) => updateSettings({ ttsPitch: pitch }),
        t: translations[settings.language],
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
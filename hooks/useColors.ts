import colors from "@/constants/colors";
import { useSettings } from "@/context/SettingsContext";

export function useColors() {
  const { darkMode } = useSettings();
  const palette = darkMode ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
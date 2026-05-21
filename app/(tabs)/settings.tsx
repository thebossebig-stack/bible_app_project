import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppSlider from "@/components/AppSlider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/context/SettingsContext";
import type { Language } from "@/constants/translations";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

const TTS_LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "fr-FR", label: "Français" },
  { code: "pt-BR", label: "Português (BR)" },
  { code: "pt-PT", label: "Português (PT)" },
  { code: "es-ES", label: "Español" },
  { code: "de-DE", label: "Deutsch" },
  { code: "it-IT", label: "Italiano" },
];

function SettingRow({ children, last }: { children: React.ReactNode; last?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.settingRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      {children}
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    t, language, darkMode, ttsLanguage, ttsRate, ttsPitch,
    setLanguage, setDarkMode, setTtsLanguage, setTtsRate, setTtsPitch,
  } = useSettings();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border, paddingTop: topPad + 12 },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.settings}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: (Platform.OS === "web" ? 84 : insets.bottom) + 80,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title={t.language} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {LANGUAGES.map((lang, idx) => (
            <SettingRow key={lang.code} last={idx === LANGUAGES.length - 1}>
              <View style={styles.rowLeft}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>{lang.label}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setLanguage(lang.code)}
                style={[
                  styles.radioBtn,
                  { borderColor: language === lang.code ? colors.primary : colors.border },
                  language === lang.code && { backgroundColor: colors.primary },
                ]}
              >
                {language === lang.code && (
                  <View style={styles.radioDot} />
                )}
              </TouchableOpacity>
            </SettingRow>
          ))}
        </View>

        <SectionTitle title={t.audioLanguage} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {TTS_LANGUAGES.map((lang, idx) => (
            <SettingRow key={lang.code} last={idx === TTS_LANGUAGES.length - 1}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{lang.label}</Text>
              <TouchableOpacity
                onPress={() => setTtsLanguage(lang.code)}
                style={[
                  styles.radioBtn,
                  { borderColor: ttsLanguage === lang.code ? colors.primary : colors.border },
                  ttsLanguage === lang.code && { backgroundColor: colors.primary },
                ]}
              >
                {ttsLanguage === lang.code && <View style={styles.radioDot} />}
              </TouchableOpacity>
            </SettingRow>
          ))}
        </View>

        <SectionTitle title={t.audioSpeed} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sliderRow}>
            <Text style={[styles.sliderLabel, { color: colors.mutedForeground }]}>{t.slow} 0.5x</Text>
            <Text style={[styles.sliderValue, { color: colors.primary }]}>{ttsRate.toFixed(1)}x</Text>
            <Text style={[styles.sliderLabel, { color: colors.mutedForeground }]}>{t.fast} 2.0x</Text>
          </View>
          <AppSlider
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.5}
            value={ttsRate}
            onValueChange={setTtsRate}
          />
        </View>

        <SectionTitle title={t.audioPitch} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sliderRow}>
            <Text style={[styles.sliderLabel, { color: colors.mutedForeground }]}>{t.low} 0.5</Text>
            <Text style={[styles.sliderValue, { color: colors.primary }]}>{ttsPitch.toFixed(1)}</Text>
            <Text style={[styles.sliderLabel, { color: colors.mutedForeground }]}>{t.high} 2.0</Text>
          </View>
          <AppSlider
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.5}
            value={ttsPitch}
            onValueChange={setTtsPitch}
          />
        </View>

        <SectionTitle title={t.nightMode} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow last>
            <View style={styles.rowLeft}>
              <Feather name="moon" size={18} color={colors.mutedForeground} />
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t.nightMode}</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.primaryForeground}
            />
          </SettingRow>
        </View>

        <SectionTitle title={t.about} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow>
            <View style={styles.rowLeft}>
              <Feather name="info" size={18} color={colors.mutedForeground} />
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t.appVersion}</Text>
            </View>
          </SettingRow>
          <SettingRow>
            <View style={styles.rowLeft}>
              <Feather name="shield" size={18} color={colors.mutedForeground} />
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t.noDataCollection}</Text>
            </View>
            <Feather name="check" size={16} color={colors.primary} />
          </SettingRow>
          <SettingRow>
            <View style={styles.rowLeft}>
              <Feather name="code" size={18} color={colors.mutedForeground} />
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t.openSource}</Text>
            </View>
          </SettingRow>
          <SettingRow last>
            <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>{t.aboutText}</Text>
          </SettingRow>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 50,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  flag: { fontSize: 20 },
  radioBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sliderLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  sliderValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  aboutText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    flex: 1,
  },
});
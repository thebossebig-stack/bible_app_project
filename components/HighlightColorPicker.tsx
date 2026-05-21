import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { HighlightColor } from "@/context/HighlightsContext";
import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/context/SettingsContext";

type Props = {
  visible: boolean;
  onSelect: (color: HighlightColor) => void;
  onRemove: () => void;
  onCancel: () => void;
  hasExisting: boolean;
};

const COLORS: { key: HighlightColor; label: string; light: string; dark: string }[] = [
  { key: "yellow", label: "●", light: "#FFF176", dark: "#F9A825" },
  { key: "green",  label: "●", light: "#A5D6A7", dark: "#388E3C" },
  { key: "blue",   label: "●", light: "#90CAF9", dark: "#1976D2" },
  { key: "pink",   label: "●", light: "#F48FB1", dark: "#C2185B" },
  { key: "purple", label: "●", light: "#CE93D8", dark: "#7B1FA2" },
];

export default function HighlightColorPicker({ visible, onSelect, onRemove, onCancel, hasExisting }: Props) {
  const colors = useColors();
  const { t } = useSettings();
  const isDark = colors.background === "#17120D";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>{t.highlightColor}</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c.key}
                onPress={() => onSelect(c.key)}
                style={[styles.colorDot, { backgroundColor: isDark ? c.dark : c.light }]}
              />
            ))}
          </View>
          {hasExisting && (
            <TouchableOpacity onPress={onRemove} style={[styles.removeBtn, { borderColor: colors.destructive }]}>
              <Text style={[styles.removeText, { color: colors.destructive }]}>{t.removeHighlight}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>{t.cancel}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 280,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  removeBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  removeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  cancelText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
});
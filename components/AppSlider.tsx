import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

type Props = {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (v: number) => void;
};

export default function AppSlider({ value, minimumValue, maximumValue, step, onValueChange }: Props) {
  const colors = useColors();

  const steps: number[] = [];
  for (let v = minimumValue; v <= maximumValue + 0.001; v = Math.round((v + step) * 10) / 10) {
    steps.push(Math.round(v * 10) / 10);
  }

  const pct = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { backgroundColor: colors.primary, width: `${pct}%` }]} />
      </View>
      <View style={styles.stepsRow}>
        {steps.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => onValueChange(s)}
            style={[
              styles.dot,
              {
                backgroundColor: s <= value ? colors.primary : colors.border,
                borderColor: s === value ? colors.primary : "transparent",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 14, paddingTop: 4 },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: -6,
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginTop: -1,
  },
});
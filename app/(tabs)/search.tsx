import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useBible } from "@/context/BibleContext";
import { useSettings } from "@/context/SettingsContext";
import type { SearchResult } from "@/context/BibleContext";

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { searchVerses } = useBible();
  const { t } = useSettings();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSearch = () => {
    Keyboard.dismiss();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      const res = searchVerses(query);
      setResults(res);
      setSearched(true);
      setLoading(false);
    }, 50);
  };

  const goToVerse = (item: SearchResult) => {
    router.push({
      pathname: "/verses",
      params: {
        bookCode: item.bookCode,
        bookName: item.bookName,
        chapter: item.chapter,
        scrollToVerse: item.verse,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            paddingTop: topPad + 12,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.search}</Text>
        <View style={styles.searchRow}>
          <View style={[styles.searchBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t.searchPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(""); setResults([]); setSearched(false); }}>
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            style={[styles.searchBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
        {!searched && (
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>{t.searchHint}</Text>
        )}
      </View>

      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {!loading && searched && results.length === 0 && (
        <View style={styles.centerState}>
          <Feather name="inbox" size={40} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t.noResults}</Text>
        </View>
      )}

      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.bookCode}_${item.chapter}_${item.verse}`}
          contentContainerStyle={{
            paddingBottom: (Platform.OS === "web" ? 84 : insets.bottom) + 70,
          }}
          ListHeaderComponent={() => (
            <Text style={[styles.resultsCount, { color: colors.mutedForeground }]}>
              {results.length} {t.searchResults}
            </Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => goToVerse(item)}
              style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.resultRef}>
                <Text style={[styles.refText, { color: colors.primary }]}>
                  {item.bookName} {item.chapter}:{item.verse}
                </Text>
                <View style={[styles.testamentBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.testamentText, { color: colors.mutedForeground }]}>
                    {item.testament}
                  </Text>
                </View>
              </View>
              <Text style={[styles.verseText, { color: colors.foreground }]} numberOfLines={3}>
                {item.text}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  searchBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  resultsCount: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  resultRef: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  testamentBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  testamentText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  verseText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useFavorites, type FavoriteVerse, type FavoriteChapter } from "@/context/FavoritesContext";
import { useHighlights, type HighlightedVerse } from "@/context/HighlightsContext";
import { useSettings } from "@/context/SettingsContext";

type SortType = "book" | "testament";
type TabType = "favorites" | "chapters" | "highlights";

const HIGHLIGHT_COLORS_LIGHT: Record<string, string> = {
  yellow: "#FFF176",
  green: "#A5D6A7",
  blue: "#90CAF9",
  pink: "#F48FB1",
  purple: "#CE93D8",
};
const HIGHLIGHT_COLORS_DARK: Record<string, string> = {
  yellow: "#F9A825",
  green: "#388E3C",
  blue: "#1976D2",
  pink: "#C2185B",
  purple: "#7B1FA2",
};

export default function LibraryScreen() {
  const router = useRouter();
  const appColors = useColors();
  const insets = useSafeAreaInsets();
  const { favorites, favoriteChapters, removeFavorite, removeChapterFavorite } = useFavorites();
  const { highlights, removeHighlight } = useHighlights();
  const { t, darkMode } = useSettings();

  const [activeTab, setActiveTab] = useState<TabType>("favorites");
  const [sortBy, setSortBy] = useState<SortType>("book");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const sortedFavorites = useMemo(() => {
    let items = [...favorites];
    if (sortBy === "book") items.sort((a, b) => a.bookOrder - b.bookOrder || a.chapter - b.chapter || a.verse - b.verse);
    else items.sort((a, b) => (a.testament === b.testament ? a.bookOrder - b.bookOrder : a.testament === "OT" ? -1 : 1));
    return items;
  }, [favorites, sortBy]);

  const sortedChapterFavorites = useMemo(() => {
    let items = [...favoriteChapters];
    if (sortBy === "book") items.sort((a, b) => a.bookOrder - b.bookOrder || a.chapter - b.chapter);
    else items.sort((a, b) => (a.testament === b.testament ? a.bookOrder - b.bookOrder : a.testament === "OT" ? -1 : 1));
    return items;
  }, [favoriteChapters, sortBy]);

  const sortedHighlights = useMemo(() => {
    let items = [...highlights];
    if (sortBy === "book") items.sort((a, b) => a.bookOrder - b.bookOrder || a.chapter - b.chapter || a.verse - b.verse);
    else items.sort((a, b) => (a.testament === b.testament ? a.bookOrder - b.bookOrder : a.testament === "OT" ? -1 : 1));
    return items;
  }, [highlights, sortBy]);

  const goToVerse = (bookCode: string, bookName: string, chapter: number, verse: number) => {
    router.push({ pathname: "/verses", params: { bookCode, bookName, chapter, scrollToVerse: verse } });
  };

  const goToChapter = (bookCode: string, bookName: string, chapter: number) => {
    router.push({ pathname: "/verses", params: { bookCode, bookName, chapter } });
  };

  const highlightColors = darkMode ? HIGHLIGHT_COLORS_DARK : HIGHLIGHT_COLORS_LIGHT;

  const renderFavorite = ({ item }: { item: FavoriteVerse }) => (
    <TouchableOpacity
      onPress={() => goToVerse(item.bookCode, item.bookName, item.chapter, item.verse)}
      style={[styles.card, { backgroundColor: appColors.card, borderColor: appColors.border }]}
    >
      <View style={styles.cardInner}>
        <View style={styles.cardHeader}>
          <Text style={[styles.ref, { color: appColors.primary }]}>
            {item.bookName} {item.chapter}:{item.verse}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(t.removeFavorite, undefined, [
                { text: t.cancel, style: "cancel" },
                { text: t.removeFavorite, style: "destructive", onPress: () => removeFavorite(item.id) },
              ]);
            }}
          >
            <Feather name="star" size={18} color={appColors.accent} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.verseText, { color: appColors.foreground, fontStyle: "italic" }]} numberOfLines={3}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChapterFavorite = ({ item }: { item: FavoriteChapter }) => (
    <TouchableOpacity
      onPress={() => goToChapter(item.bookCode, item.bookName, item.chapter)}
      style={[styles.card, { backgroundColor: appColors.card, borderColor: appColors.border }]}
    >
      <View style={styles.cardInner}>
        <View style={styles.cardHeader}>
          <View style={styles.chapterRefRow}>
            <Feather name="book-open" size={16} color={appColors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.ref, { color: appColors.primary }]}>
              {item.bookName} — {t.chapter} {item.chapter}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(t.removeChapterFavorite, undefined, [
                { text: t.cancel, style: "cancel" },
                { text: t.removeChapterFavorite, style: "destructive", onPress: () => removeChapterFavorite(item.id) },
              ]);
            }}
          >
            <Feather name="star" size={18} color={appColors.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHighlight = ({ item }: { item: HighlightedVerse }) => (
    <TouchableOpacity
      onPress={() => goToVerse(item.bookCode, item.bookName, item.chapter, item.verse)}
      style={[styles.card, { backgroundColor: appColors.card, borderColor: appColors.border }]}
    >
      <View style={[styles.highlightStripe, { backgroundColor: highlightColors[item.color] }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.ref, { color: appColors.primary }]}>
            {item.bookName} {item.chapter}:{item.verse}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(t.removeHighlight, undefined, [
                { text: t.cancel, style: "cancel" },
                { text: t.removeHighlight, style: "destructive", onPress: () => removeHighlight(item.id) },
              ]);
            }}
          >
            <Feather name="x-circle" size={18} color={appColors.mutedForeground} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.verseText, { color: appColors.foreground }]} numberOfLines={3}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const tabs: { key: TabType; label: string }[] = [
    { key: "favorites", label: t.favorites },
    { key: "chapters", label: t.chapterFavorites },
    { key: "highlights", label: t.highlights },
  ];

  const isEmpty =
    activeTab === "favorites" ? sortedFavorites.length === 0 :
    activeTab === "chapters" ? sortedChapterFavorites.length === 0 :
    sortedHighlights.length === 0;

  const emptyText =
    activeTab === "favorites" ? t.noFavorites :
    activeTab === "chapters" ? t.noChapterFavorites :
    t.noHighlights;

  const listData =
    activeTab === "favorites" ? sortedFavorites :
    activeTab === "chapters" ? sortedChapterFavorites :
    sortedHighlights;

  return (
    <View style={[styles.container, { backgroundColor: appColors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: appColors.background, borderBottomColor: appColors.border, paddingTop: topPad + 12 },
        ]}
      >
        <Text style={[styles.headerTitle, { color: appColors.foreground }]}>{t.library}</Text>

        <View style={[styles.tabs, { backgroundColor: appColors.secondary }]}>
          {tabs.map(({ key, label }) => (
            <Pressable
              key={key}
              onPress={() => setActiveTab(key)}
              style={[styles.tab, activeTab === key && { backgroundColor: appColors.background }]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === key ? appColors.foreground : appColors.mutedForeground },
              ]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sortRow}>
          <Text style={[styles.sortLabel, { color: appColors.mutedForeground }]}>{t.sortBy}:</Text>
          {(["book", "testament"] as SortType[]).map((s) => (
            <Pressable
              key={s}
              onPress={() => setSortBy(s)}
              style={[styles.sortChip, { backgroundColor: sortBy === s ? appColors.primary : appColors.secondary }]}
            >
              <Text style={[styles.sortChipText, { color: sortBy === s ? appColors.primaryForeground : appColors.mutedForeground }]}>
                {s === "book" ? t.sortByBook : t.sortByTestament}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <Feather
            name={activeTab === "highlights" ? "edit-3" : "star"}
            size={48}
            color={appColors.mutedForeground}
          />
          <Text style={[styles.emptyText, { color: appColors.mutedForeground }]}>{emptyText}</Text>
        </View>
      ) : (
        <FlatList
          data={listData as any[]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            gap: 10,
            paddingBottom: (Platform.OS === "web" ? 84 : insets.bottom) + 80,
          }}
          renderItem={
            activeTab === "favorites" ? renderFavorite :
            activeTab === "chapters" ? renderChapterFavorite :
            renderHighlight as any
          }
          scrollEnabled
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
  tabs: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sortLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  sortChip: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sortChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  cardInner: {
    flex: 1,
    gap: 6,
  },
  highlightStripe: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  chapterRefRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    paddingBottom: 6,
    flex: 1,
  },
  ref: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  verseText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
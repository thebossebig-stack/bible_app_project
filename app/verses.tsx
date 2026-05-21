import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useBible } from "@/context/BibleContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useHighlights, type HighlightColor } from "@/context/HighlightsContext";
import { useSettings } from "@/context/SettingsContext";
import { usePosition } from "@/context/PositionContext";
import { BIBLE_BOOKS } from "@/constants/bible-books";
import HighlightColorPicker from "@/components/HighlightColorPicker";

const HIGHLIGHT_COLORS_LIGHT: Record<string, string> = {
  yellow: "#FFF176",
  green: "#A5D6A7",
  blue: "#90CAF9",
  pink: "#F48FB1",
  purple: "#CE93D8",
};
const HIGHLIGHT_COLORS_DARK: Record<string, string> = {
  yellow: "#F9A82520",
  green: "#388E3C20",
  blue: "#1976D220",
  pink: "#C2185B20",
  purple: "#7B1FA220",
};

type VerseEntry = { verse: number; text: string };

export default function VersesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getChapterVerses } = useBible();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { highlights, addHighlight, removeHighlight, getHighlight } = useHighlights();
  const { t, ttsLanguage, ttsRate, ttsPitch, darkMode } = useSettings();
  const { savePosition } = usePosition();

  const params = useLocalSearchParams<{
    bookCode: string;
    bookName: string;
    chapter: string;
    scrollToVerse?: string;
  }>();
  const bookCode = params.bookCode ?? "";
  const bookName = params.bookName ?? "";
  const chapter = parseInt(params.chapter ?? "1");
  const scrollToVerse = params.scrollToVerse ? parseInt(params.scrollToVerse) : undefined;

  const [speakingVerse, setSpeakingVerse] = useState<number | null>(null);
  const [speakingAll, setSpeakingAll] = useState(false);
  const [highlightPickerVerse, setHighlightPickerVerse] = useState<number | null>(null);

  const listRef = useRef<FlatList>(null);
  const swiping = useRef(false);

  const book = BIBLE_BOOKS.find((b) => b.code === bookCode);
  const totalChapters = book?.chapters ?? 1;

  const rawVerses = useMemo(() => getChapterVerses(bookCode, chapter), [bookCode, chapter, getChapterVerses]);

  const verses: VerseEntry[] = useMemo(
    () => Object.entries(rawVerses).map(([v, text]) => ({ verse: parseInt(v), text })).sort((a, b) => a.verse - b.verse),
    [rawVerses]
  );

  const hasContent = verses.length > 0;

  useEffect(() => {
    if (bookCode && bookName && chapter) {
      savePosition(bookCode, bookName, chapter, scrollToVerse ?? 1);
    }
  }, [bookCode, bookName, chapter]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => {
        return Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5;
      },
      onPanResponderRelease: (_, gs) => {
        if (swiping.current) return;
        const SWIPE_THRESHOLD = 60;
        if (Math.abs(gs.dx) < SWIPE_THRESHOLD) return;
        swiping.current = true;
        setTimeout(() => { swiping.current = false; }, 600);
        if (gs.dx < 0 && chapter < totalChapters) {
          router.replace({
            pathname: "/verses",
            params: { bookCode, bookName, chapter: chapter + 1 },
          });
        } else if (gs.dx > 0 && chapter > 1) {
          router.replace({
            pathname: "/verses",
            params: { bookCode, bookName, chapter: chapter - 1 },
          });
        }
      },
    })
  ).current;

  useEffect(() => {
    navigation.setOptions({
      title: `${bookName} ${chapter}`,
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.foreground,
      headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: colors.foreground },
      headerBackTitle: bookName,
      headerRight: () => (
        <TouchableOpacity
          onPress={hasContent ? handleReadAll : undefined}
          style={{ marginRight: 8, padding: 4 }}
        >
          <Feather
            name={speakingAll ? "stop-circle" : "volume-2"}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [bookName, chapter, colors, hasContent, speakingAll]);

  useEffect(() => {
    if (scrollToVerse && verses.length > 0) {
      const idx = verses.findIndex((v) => v.verse === scrollToVerse);
      if (idx >= 0) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.3 });
        }, 400);
      }
    }
  }, [scrollToVerse, verses]);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const speakText = useCallback(async (text: string, verseNum: number | null, all: boolean) => {
    await Speech.stop();
    setSpeakingVerse(verseNum);
    setSpeakingAll(all);
    Speech.speak(text, {
      language: ttsLanguage,
      rate: ttsRate,
      pitch: ttsPitch,
      onDone: () => { setSpeakingVerse(null); setSpeakingAll(false); },
      onStopped: () => { setSpeakingVerse(null); setSpeakingAll(false); },
      onError: () => { setSpeakingVerse(null); setSpeakingAll(false); },
    });
  }, [ttsLanguage, ttsRate, ttsPitch]);

  const handleVerseAudio = useCallback(async (v: VerseEntry) => {
    if (speakingVerse === v.verse) {
      await Speech.stop();
      setSpeakingVerse(null);
      return;
    }
    await speakText(v.text, v.verse, false);
  }, [speakingVerse, speakText]);

  const handleReadAll = useCallback(async () => {
    if (speakingAll) {
      await Speech.stop();
      setSpeakingAll(false);
      return;
    }
    const intro = `Livre ${bookName}, chapitre ${chapter}. `;
    const body = verses.map((v) => v.text).join(" ");
    await speakText(intro + body, null, true);
  }, [speakingAll, verses, bookName, chapter, speakText]);

  const toggleFavorite = useCallback((v: VerseEntry) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const id = `${bookCode}_${chapter}_${v.verse}`;
    if (isFavorite(bookCode, chapter, v.verse)) {
      removeFavorite(id);
    } else {
      addFavorite({
        id,
        bookCode,
        bookName,
        chapter,
        verse: v.verse,
        text: v.text,
        testament: book?.testament ?? "OT",
        bookOrder: book?.id ?? 1,
      });
    }
  }, [bookCode, bookName, chapter, book, isFavorite, addFavorite, removeFavorite]);

  const openHighlightPicker = useCallback((v: VerseEntry) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHighlightPickerVerse(v.verse);
  }, []);

  const handleHighlightSelect = useCallback((color: HighlightColor) => {
    if (highlightPickerVerse === null) return;
    const verseEntry = verses.find((v) => v.verse === highlightPickerVerse);
    if (!verseEntry) return;
    addHighlight({
      id: `${bookCode}_${chapter}_${highlightPickerVerse}`,
      bookCode,
      bookName,
      chapter,
      verse: highlightPickerVerse,
      text: verseEntry.text,
      color,
      testament: book?.testament ?? "OT",
      bookOrder: book?.id ?? 1,
    });
    setHighlightPickerVerse(null);
  }, [highlightPickerVerse, verses, bookCode, bookName, chapter, book, addHighlight]);

  const handleHighlightRemove = useCallback(() => {
    if (highlightPickerVerse === null) return;
    removeHighlight(`${bookCode}_${chapter}_${highlightPickerVerse}`);
    setHighlightPickerVerse(null);
  }, [highlightPickerVerse, bookCode, chapter, removeHighlight]);

  const highlightMap = useMemo(() => {
    const map: Record<number, string> = {};
    const colorMap = darkMode ? HIGHLIGHT_COLORS_DARK : HIGHLIGHT_COLORS_LIGHT;
    for (const h of highlights) {
      if (h.bookCode === bookCode && h.chapter === chapter) {
        map[h.verse] = colorMap[h.color] ?? "transparent";
      }
    }
    return map;
  }, [highlights, bookCode, chapter, darkMode]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<{ item: VerseEntry }> }) => {
    if (viewableItems.length > 0) {
      const visibleVerse = viewableItems[0]!.item.verse;
      savePosition(bookCode, bookName, chapter, visibleVerse);
    }
  }, [bookCode, bookName, chapter, savePosition]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  const renderVerse = useCallback(({ item }: { item: VerseEntry }) => {
    const fav = isFavorite(bookCode, chapter, item.verse);
    const highlightBg = highlightMap[item.verse];
    const isSpeaking = speakingVerse === item.verse;
    const isScrollTarget = scrollToVerse === item.verse;

    return (
      <Pressable
        onLongPress={() => openHighlightPicker(item)}
        delayLongPress={400}
        style={[
          styles.verseRow,
          { borderBottomColor: colors.border },
          highlightBg ? { backgroundColor: highlightBg } : undefined,
          isScrollTarget && { borderLeftWidth: 3, borderLeftColor: colors.primary },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleFavorite(item)}
          style={styles.starBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather
            name="star"
            size={16}
            color={fav ? colors.accent : colors.border}
          />
        </TouchableOpacity>

        <View style={styles.verseContent}>
          <Text style={[styles.verseNum, { color: colors.primary }]}>{item.verse}</Text>
          <Text style={[
            styles.verseText,
            { color: colors.foreground },
            fav && styles.verseTextFav,
          ]}>
            {item.text}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleVerseAudio(item)}
          style={styles.audioBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather
            name={isSpeaking ? "stop-circle" : "volume-2"}
            size={16}
            color={isSpeaking ? colors.primary : colors.mutedForeground}
          />
        </TouchableOpacity>
      </Pressable>
    );
  }, [bookCode, chapter, colors, isFavorite, highlightMap, speakingVerse, scrollToVerse, toggleFavorite, handleVerseAudio, openHighlightPicker]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} {...panResponder.panHandlers}>
      {!hasContent ? (
        <View style={styles.emptyState}>
          <Feather name="book" size={40} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t.textNotAvailable}</Text>
          <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>{t.textNotAvailableHint}</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={verses}
          keyExtractor={(item) => item.verse.toString()}
          onScrollToIndexFailed={() => {}}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig.current}
          contentContainerStyle={{
            paddingBottom: (Platform.OS === "web" ? 84 : insets.bottom) + 20,
          }}
          ListHeaderComponent={() => (
            <View style={styles.chapterHeaderRow}>
              <TouchableOpacity
                onPress={() => chapter > 1 && router.replace({ pathname: "/verses", params: { bookCode, bookName, chapter: chapter - 1 } })}
                style={[styles.navBtn, { opacity: chapter > 1 ? 1 : 0.3 }]}
                disabled={chapter <= 1}
              >
                <Feather name="chevron-left" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.chapterHeader, { color: colors.mutedForeground }]}>
                {bookName} — {t.chapter} {chapter}
              </Text>
              <TouchableOpacity
                onPress={() => chapter < totalChapters && router.replace({ pathname: "/verses", params: { bookCode, bookName, chapter: chapter + 1 } })}
                style={[styles.navBtn, { opacity: chapter < totalChapters ? 1 : 0.3 }]}
                disabled={chapter >= totalChapters}
              >
                <Feather name="chevron-right" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          renderItem={renderVerse}
          scrollEnabled
          showsVerticalScrollIndicator={false}
        />
      )}

      <HighlightColorPicker
        visible={highlightPickerVerse !== null}
        onSelect={handleHighlightSelect}
        onRemove={handleHighlightRemove}
        onCancel={() => setHighlightPickerVerse(null)}
        hasExisting={highlightPickerVerse !== null && getHighlight(bookCode, chapter, highlightPickerVerse!) !== undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chapterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  navBtn: {
    padding: 8,
  },
  chapterHeader: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  verseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  starBtn: {
    paddingTop: 2,
    width: 24,
    alignItems: "center",
  },
  audioBtn: {
    paddingTop: 2,
    width: 24,
    alignItems: "center",
  },
  verseContent: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  verseNum: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    paddingTop: 2,
    minWidth: 20,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
  },
  verseTextFav: {
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
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
import { usePosition } from "@/context/PositionContext";
import type { BibleBook } from "@/constants/bible-books";

function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.secondary }]}>
      <Text style={[styles.sectionHeaderText, { color: colors.primary }]}>{title}</Text>
    </View>
  );
}

function BookRow({ book, onPress, colors, language }: { book: BibleBook; onPress: () => void; colors: ReturnType<typeof useColors>; language: string }) {
  const lang = language as "en" | "fr" | "pt";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.bookRow,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.bookNumber, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.bookNumberText, { color: colors.mutedForeground }]}>{book.id}</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={[styles.bookName, { color: colors.foreground }]}>{book.name[lang]}</Text>
        <Text style={[styles.bookMeta, { color: colors.mutedForeground }]}>
          {book.chapters} ch.
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function BooksScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { books } = useBible();
  const { t, language } = useSettings();
  const { isLoaded, lastPosition } = usePosition();
  const [searchQuery, setSearchQuery] = useState("");

  const hasNavigated = useRef(false);
  const lang = language as "en" | "fr" | "pt";

  useEffect(() => {
    if (isLoaded && lastPosition && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push({
        pathname: "/verses",
        params: {
          bookCode: lastPosition.bookCode,
          bookName: lastPosition.bookName,
          chapter: lastPosition.chapter,
          scrollToVerse: lastPosition.verse,
        },
      });
    }
  }, [isLoaded, lastPosition]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase();
    return books.filter((b) =>
      b.name.en.toLowerCase().includes(q) ||
      b.name.fr.toLowerCase().includes(q) ||
      b.name.pt.toLowerCase().includes(q) ||
      b.abbr.en.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  const otBooks = filtered.filter((b) => b.testament === "OT");
  const ntBooks = filtered.filter((b) => b.testament === "NT");

  type ListItem =
    | { type: "header"; title: string; key: string }
    | { type: "book"; book: BibleBook; key: string };

  const listData: ListItem[] = [];
  if (otBooks.length > 0) {
    listData.push({ type: "header", title: t.oldTestament, key: "ot_header" });
    otBooks.forEach((b) => listData.push({ type: "book", book: b, key: b.code }));
  }
  if (ntBooks.length > 0) {
    listData.push({ type: "header", title: t.newTestament, key: "nt_header" });
    ntBooks.forEach((b) => listData.push({ type: "book", book: b, key: b.code }));
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border, paddingTop: topPad + 12 },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.home}</Text>
          {isLoaded && lastPosition && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/verses",
                  params: {
                    bookCode: lastPosition.bookCode,
                    bookName: lastPosition.bookName,
                    chapter: lastPosition.chapter,
                    scrollToVerse: lastPosition.verse,
                  },
                })
              }
              style={[styles.continueBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="play" size={12} color={colors.primaryForeground} />
              <Text style={[styles.continueBtnText, { color: colors.primaryForeground }]}>
                {lastPosition.bookName} {lastPosition.chapter}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.searchBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t.allBooks}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          paddingBottom: (Platform.OS === "web" ? 84 : insets.bottom) + 70,
        }}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return <SectionHeader title={item.title} />;
          }
          return (
            <BookRow
              book={item.book}
              colors={colors}
              language={lang}
              onPress={() =>
                router.push({
                  pathname: "/chapters",
                  params: { bookCode: item.book.code, bookName: item.book.name[lang], chapters: item.book.chapters },
                })
              }
            />
          );
        }}
        scrollEnabled={listData.length > 0}
      />
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  continueBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  searchBar: {
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  bookNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bookNumberText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  bookInfo: { flex: 1 },
  bookName: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  bookMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
});
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
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
import { useSettings } from "@/context/SettingsContext";
import { useFavorites, type FavoriteChapter } from "@/context/FavoritesContext";
import { usePosition } from "@/context/PositionContext";
import { BIBLE_BOOKS } from "@/constants/bible-books";

const NUM_COLUMNS = 5;

export default function ChaptersScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useSettings();
  const { isChapterFavorite, addChapterFavorite, removeChapterFavorite } = useFavorites();
  const { getLastChapter } = usePosition();

  const params = useLocalSearchParams<{ bookCode: string; bookName: string; chapters: string }>();
  const bookCode = params.bookCode ?? "";
  const bookName = params.bookName ?? "";
  const totalChapters = parseInt(params.chapters ?? "1");

  const book = BIBLE_BOOKS.find((b) => b.code === bookCode);
  const lastChapter = getLastChapter(bookCode);

  useEffect(() => {
    navigation.setOptions({
      title: bookName,
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.foreground,
      headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: colors.foreground },
      headerBackTitle: t.home,
    });
  }, [bookName, colors, t]);

  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  const toggleChapterFavorite = (chapterNum: number) => {
    const id = `${bookCode}_${chapterNum}`;
    if (isChapterFavorite(bookCode, chapterNum)) {
      removeChapterFavorite(id);
    } else {
      const fav: FavoriteChapter = {
        id,
        bookCode,
        bookName,
        chapter: chapterNum,
        testament: book?.testament ?? "OT",
        bookOrder: book?.id ?? 1,
      };
      addChapterFavorite(fav);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        {totalChapters} {t.chapters}
      </Text>
      <FlatList
        data={chapters}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{
          padding: 16,
          gap: 10,
          paddingBottom: (Platform.OS === "web" ? 84 : insets.bottom) + 20,
        }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }) => {
          const isFav = isChapterFavorite(bookCode, item);
          const isLast = lastChapter === item;
          return (
            <View style={[styles.chapterCell, { maxWidth: `${100 / 5 - 3}%` as any }]}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/verses",
                    params: { bookCode, bookName, chapter: item },
                  })
                }
                style={({ pressed }) => [
                  styles.chapterBtn,
                  {
                    backgroundColor: isLast ? colors.primary : colors.card,
                    borderColor: isLast ? colors.primary : colors.border,
                  },
                  pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                ]}
              >
                <Text style={[
                  styles.chapterNum,
                  { color: isLast ? colors.primaryForeground : colors.foreground },
                ]}>
                  {item}
                </Text>
              </Pressable>
              <TouchableOpacity
                onPress={() => toggleChapterFavorite(item)}
                style={styles.starBtn}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Feather
                  name="star"
                  size={11}
                  color={isFav ? colors.accent : colors.border}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        scrollEnabled={!!chapters.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  chapterCell: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  chapterBtn: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  chapterNum: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  starBtn: {
    padding: 2,
  },
});
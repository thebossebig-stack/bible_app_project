import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type FavoriteVerse = {
  id: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  testament: "OT" | "NT";
  bookOrder: number;
};

export type FavoriteChapter = {
  id: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  testament: "OT" | "NT";
  bookOrder: number;
};

type FavoritesContextType = {
  favorites: FavoriteVerse[];
  favoriteChapters: FavoriteChapter[];
  addFavorite: (v: FavoriteVerse) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (bookCode: string, chapter: number, verse: number) => boolean;
  addChapterFavorite: (c: FavoriteChapter) => void;
  removeChapterFavorite: (id: string) => void;
  isChapterFavorite: (bookCode: string, chapter: number) => boolean;
};

const STORAGE_KEY = "@bible_favorites";
const CHAPTER_STORAGE_KEY = "@bible_chapter_favorites";

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  favoriteChapters: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  addChapterFavorite: () => {},
  removeChapterFavorite: () => {},
  isChapterFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [favoriteChapters, setFavoriteChapters] = useState<FavoriteChapter[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) { try { setFavorites(JSON.parse(val)); } catch {} }
    });
    AsyncStorage.getItem(CHAPTER_STORAGE_KEY).then((val) => {
      if (val) { try { setFavoriteChapters(JSON.parse(val)); } catch {} }
    });
  }, []);

  const persistVerses = useCallback((items: FavoriteVerse[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const persistChapters = useCallback((items: FavoriteChapter[]) => {
    AsyncStorage.setItem(CHAPTER_STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addFavorite = useCallback((v: FavoriteVerse) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === v.id)) return prev;
      const next = [v, ...prev];
      persistVerses(next);
      return next;
    });
  }, [persistVerses]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      persistVerses(next);
      return next;
    });
  }, [persistVerses]);

  const isFavorite = useCallback((bookCode: string, chapter: number, verse: number) => {
    const id = `${bookCode}_${chapter}_${verse}`;
    return favorites.some((f) => f.id === id);
  }, [favorites]);

  const addChapterFavorite = useCallback((c: FavoriteChapter) => {
    setFavoriteChapters((prev) => {
      if (prev.find((f) => f.id === c.id)) return prev;
      const next = [c, ...prev];
      persistChapters(next);
      return next;
    });
  }, [persistChapters]);

  const removeChapterFavorite = useCallback((id: string) => {
    setFavoriteChapters((prev) => {
      const next = prev.filter((f) => f.id !== id);
      persistChapters(next);
      return next;
    });
  }, [persistChapters]);

  const isChapterFavorite = useCallback((bookCode: string, chapter: number) => {
    const id = `${bookCode}_${chapter}`;
    return favoriteChapters.some((f) => f.id === id);
  }, [favoriteChapters]);

  return (
    <FavoritesContext.Provider value={{
      favorites, favoriteChapters,
      addFavorite, removeFavorite, isFavorite,
      addChapterFavorite, removeChapterFavorite, isChapterFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
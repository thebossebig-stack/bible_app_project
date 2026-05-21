export type Language = "en" | "fr" | "pt";

export type Translations = {
  home: string;
  search: string;
  library: string;
  settings: string;
  oldTestament: string;
  newTestament: string;
  chapter: string;
  chapters: string;
  verse: string;
  verses: string;
  favorites: string;
  highlights: string;
  chapterFavorites: string;
  noFavorites: string;
  noHighlights: string;
  noChapterFavorites: string;
  removeFavorite: string;
  removeHighlight: string;
  removeChapterFavorite: string;
  searchPlaceholder: string;
  searchResults: string;
  noResults: string;
  searchHint: string;
  language: string;
  interfaceLanguage: string;
  audioLanguage: string;
  audioSpeed: string;
  audioPitch: string;
  nightMode: string;
  about: string;
  aboutText: string;
  readChapter: string;
  stopAudio: string;
  textNotAvailable: string;
  textNotAvailableHint: string;
  sortBy: string;
  sortByBook: string;
  sortByTestament: string;
  highlightColor: string;
  cancel: string;
  allBooks: string;
  goToVerse: string;
  bookNotFound: string;
  normal: string;
  slow: string;
  fast: string;
  low: string;
  high: string;
  appVersion: string;
  license: string;
  noDataCollection: string;
  openSource: string;
  continueReading: string;
  favoriteChapter: string;
  unfavoriteChapter: string;
};

const translations: Record<Language, Translations> = {
  fr: {
    home: "Livres",
    search: "Recherche",
    library: "Bibliothèque",
    settings: "Paramètres",
    oldTestament: "Ancien Testament",
    newTestament: "Nouveau Testament",
    chapter: "Chapitre",
    chapters: "Chapitres",
    verse: "Verset",
    verses: "Versets",
    favorites: "Versets",
    highlights: "Surlignages",
    chapterFavorites: "Chapitres",
    noFavorites: "Aucun verset favori",
    noHighlights: "Aucun surlignage pour l'instant",
    noChapterFavorites: "Aucun chapitre favori",
    removeFavorite: "Retirer des favoris",
    removeHighlight: "Retirer le surlignage",
    removeChapterFavorite: "Retirer des favoris",
    searchPlaceholder: "Chercher un verset, mot-clé ou thème...",
    searchResults: "Résultats",
    noResults: "Aucun résultat trouvé",
    searchHint: "Essayez \"Jean 3:16\", \"amour\" ou \"Noé et l'arche\"",
    language: "Langue",
    interfaceLanguage: "Langue de l'interface",
    audioLanguage: "Langue audio",
    audioSpeed: "Vitesse audio",
    audioPitch: "Tonalité vocale",
    nightMode: "Mode nuit",
    about: "À propos",
    aboutText: "Application Bible gratuite et open source. Pas de publicité. Pas de collecte de données. Pas de réseau requis.",
    readChapter: "Lire le chapitre",
    stopAudio: "Arrêter l'audio",
    textNotAvailable: "Texte à venir",
    textNotAvailableHint: "Ce chapitre n'est pas encore disponible.",
    sortBy: "Trier par",
    sortByBook: "Livre",
    sortByTestament: "Testament",
    highlightColor: "Choisir une couleur",
    cancel: "Annuler",
    allBooks: "Tous les livres",
    goToVerse: "Aller au verset",
    bookNotFound: "Livre introuvable",
    normal: "Normal",
    slow: "Lent",
    fast: "Rapide",
    low: "Grave",
    high: "Aigu",
    appVersion: "Version 1.0.0",
    license: "Licence : MIT / Domaine Public",
    noDataCollection: "Aucune collecte de données",
    openSource: "Open Source",
    continueReading: "Continuer la lecture",
    favoriteChapter: "Ajouter aux favoris",
    unfavoriteChapter: "Retirer des favoris",
  },
  en: {
    home: "Books",
    search: "Search",
    library: "Library",
    settings: "Settings",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    chapter: "Chapter",
    chapters: "Chapters",
    verse: "Verse",
    verses: "Verses",
    favorites: "Verses",
    highlights: "Highlights",
    chapterFavorites: "Chapters",
    noFavorites: "No favorite verses yet",
    noHighlights: "No highlights yet",
    noChapterFavorites: "No favorite chapters yet",
    removeFavorite: "Remove from favorites",
    removeHighlight: "Remove highlight",
    removeChapterFavorite: "Remove from favorites",
    searchPlaceholder: "Search verse, keyword or theme...",
    searchResults: "Results",
    noResults: "No results found",
    searchHint: "Try \"John 3:16\", \"love\", or \"Noah and the ark\"",
    language: "Language",
    interfaceLanguage: "Interface Language",
    audioLanguage: "Audio Language",
    audioSpeed: "Audio Speed",
    audioPitch: "Voice Pitch",
    nightMode: "Night Mode",
    about: "About",
    aboutText: "Free, open source Bible app. No ads. No data collection. No network required.",
    readChapter: "Read Chapter",
    stopAudio: "Stop Audio",
    textNotAvailable: "Text coming soon",
    textNotAvailableHint: "This chapter is not yet available.",
    sortBy: "Sort by",
    sortByBook: "Book",
    sortByTestament: "Testament",
    highlightColor: "Choose highlight color",
    cancel: "Cancel",
    allBooks: "All Books",
    goToVerse: "Go to verse",
    bookNotFound: "Book not found",
    normal: "Normal",
    slow: "Slow",
    fast: "Fast",
    low: "Low",
    high: "High",
    appVersion: "Version 1.0.0",
    license: "License: MIT / Public Domain",
    noDataCollection: "No data collection",
    openSource: "Open Source",
    continueReading: "Continue Reading",
    favoriteChapter: "Add to favorites",
    unfavoriteChapter: "Remove from favorites",
  },
  pt: {
    home: "Livros",
    search: "Pesquisa",
    library: "Biblioteca",
    settings: "Configurações",
    oldTestament: "Antigo Testamento",
    newTestament: "Novo Testamento",
    chapter: "Capítulo",
    chapters: "Capítulos",
    verse: "Versículo",
    verses: "Versículos",
    favorites: "Versículos",
    highlights: "Destaques",
    chapterFavorites: "Capítulos",
    noFavorites: "Nenhum versículo favorito",
    noHighlights: "Nenhum destaque ainda",
    noChapterFavorites: "Nenhum capítulo favorito",
    removeFavorite: "Remover dos favoritos",
    removeHighlight: "Remover destaque",
    removeChapterFavorite: "Remover dos favoritos",
    searchPlaceholder: "Buscar versículo, palavra ou tema...",
    searchResults: "Resultados",
    noResults: "Nenhum resultado encontrado",
    searchHint: "Tente \"João 3:16\", \"amor\" ou \"Noé e a arca\"",
    language: "Idioma",
    interfaceLanguage: "Idioma da interface",
    audioLanguage: "Idioma do áudio",
    audioSpeed: "Velocidade do áudio",
    audioPitch: "Tom da voz",
    nightMode: "Modo noturno",
    about: "Sobre",
    aboutText: "Aplicativo Bíblico gratuito e de código aberto. Sem anúncios. Sem coleta de dados. Sem rede necessária.",
    readChapter: "Ler capítulo",
    stopAudio: "Parar áudio",
    textNotAvailable: "Texto em breve",
    textNotAvailableHint: "Este capítulo ainda não está disponível.",
    sortBy: "Ordenar por",
    sortByBook: "Livro",
    sortByTestament: "Testamento",
    highlightColor: "Escolher cor de destaque",
    cancel: "Cancelar",
    allBooks: "Todos os livros",
    goToVerse: "Ir para o versículo",
    bookNotFound: "Livro não encontrado",
    normal: "Normal",
    slow: "Lento",
    fast: "Rápido",
    low: "Grave",
    high: "Agudo",
    appVersion: "Versão 1.0.0",
    license: "Licença: MIT / Domínio Público",
    noDataCollection: "Sem coleta de dados",
    openSource: "Código Aberto",
    continueReading: "Continuar Lendo",
    favoriteChapter: "Adicionar aos favoritos",
    unfavoriteChapter: "Remover dos favoritos",
  },
};

export default translations;
export const thematicDictionary: Record<string, string[]> = {
  creation: ["created", "heaven", "earth", "God", "light", "darkness", "waters", "firmament", "beginning", "void"],
  noah: ["Noah", "ark", "flood", "rainbow", "dove", "raven", "waters", "forty", "rain", "covenant"],
  "david goliath": ["David", "Goliath", "stone", "sling", "Philistine", "giant", "uncircumcised", "battle"],
  exodus: ["Moses", "Egypt", "Pharaoh", "plagues", "passover", "Red Sea", "wilderness", "manna", "commandments"],
  love: ["love", "charity", "beloved", "lovingkindness", "mercy", "compassion", "heart", "care"],
  faith: ["faith", "believe", "trust", "confidence", "hope", "assurance", "substance", "evidence"],
  prayer: ["pray", "prayer", "supplication", "petition", "ask", "seek", "knock", "intercession"],
  salvation: ["saved", "salvation", "redeemed", "redemption", "forgiveness", "grace", "eternal life", "born again"],
  peace: ["peace", "comfort", "still", "quiet", "rest", "tranquil", "shalom", "strife"],
  wisdom: ["wisdom", "wise", "understanding", "knowledge", "counsel", "discernment", "prudence", "instruction"],
  healing: ["heal", "healed", "sick", "disease", "restored", "wholeness", "physician", "lame", "blind"],
  resurrection: ["risen", "resurrection", "raised", "alive", "tomb", "death", "life", "appear", "ascended"],
  baptism: ["baptize", "baptism", "water", "spirit", "immersed", "washed", "cleansed", "born of water"],
  communion: ["bread", "wine", "body", "blood", "covenant", "supper", "table", "cup", "remember"],
  holiness: ["holy", "sanctified", "set apart", "pure", "righteous", "blameless", "consecrated", "undefiled"],
  prophecy: ["prophet", "prophesy", "vision", "dream", "word of the LORD", "thus saith", "oracle", "foretold"],
  angels: ["angel", "angels", "host", "cherubim", "seraphim", "Michael", "Gabriel", "messenger", "heavenly"],
  temptation: ["tempt", "temptation", "devil", "Satan", "evil one", "lust", "desires", "flee", "resist"],
  forgiveness: ["forgive", "forgiven", "pardon", "sins", "transgressions", "mercy", "repent", "reconcile"],
  "ten commandments": ["commandments", "law", "Moses", "Sinai", "tablets", "jealous God", "Sabbath", "honor"],
  "sermon on the mount": ["blessed", "beatitudes", "poor in spirit", "meek", "peacemakers", "pure in heart", "salt", "light"],
  "prodigal son": ["prodigal", "son", "father", "robe", "ring", "feast", "lost", "found", "returned", "pig"],
  "good samaritan": ["Samaritan", "neighbor", "mercy", "beaten", "road", "priest", "Levite", "inn", "wounded"],
  jonah: ["Jonah", "whale", "fish", "Nineveh", "three days", "swallowed", "belly", "repent", "gourd"],
  daniel: ["Daniel", "lions", "den", "Nebuchadnezzar", "Shadrach", "Meshach", "fiery furnace", "Babylon"],
};

export function thematicSearch(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const keywords: string[] = [];

  for (const [theme, words] of Object.entries(thematicDictionary)) {
    const themeWords = theme.split(" ");
    const matches = themeWords.some((w) => lowerQuery.includes(w));
    if (matches) {
      keywords.push(...words);
    }
  }

  if (keywords.length === 0) {
    return lowerQuery.split(/\s+/).filter((w) => w.length > 3);
  }

  return [...new Set(keywords)];
}
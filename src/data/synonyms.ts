export interface SynonymGroup {
  canonical: string;
  aliases: string[];
}

export const RECIPIENT_SYNONYMS: SynonymGroup[] = [
  {
    canonical: "Dad",
    aliases: ["dad", "father", "papa", "pops", "daddy", "father-in-law", "stepdad", "stepfather"]
  },
  {
    canonical: "Mom",
    aliases: ["mom", "mother", "mama", "mum", "mommy", "mother-in-law", "stepmom", "stepmother"]
  },
  {
    canonical: "Brother",
    aliases: ["brother", "bro", "brother-in-law", "stepbrother"]
  },
  {
    canonical: "Sister",
    aliases: ["sister", "sis", "sister-in-law", "stepsister"]
  },
  {
    canonical: "Husband",
    aliases: ["husband", "hubby", "groom"]
  },
  {
    canonical: "Wife",
    aliases: ["wife", "wifey", "bride"]
  },
  {
    canonical: "Partner",
    aliases: ["partner", "significant other", "spouse", "fiance", "fiancee"]
  },
  {
    canonical: "Boyfriend",
    aliases: ["boyfriend", "bf", "guy friend"]
  },
  {
    canonical: "Girlfriend",
    aliases: ["girlfriend", "gf", "lady friend"]
  },
  {
    canonical: "Friend",
    aliases: ["friend", "best friend", "bestie", "buddy", "pal", "mate", "roommate"]
  },
  {
    canonical: "Coworker",
    aliases: ["coworker", "colleague", "work friend", "boss", "manager", "teammate", "office mate", "client"]
  },
  {
    canonical: "Teacher",
    aliases: ["teacher", "professor", "educator", "instructor", "mentor", "advisor", "tutor"]
  },
  {
    canonical: "Historian",
    aliases: ["historian", "history buff", "history enthusiast", "history nerd", "academic"]
  },
  {
    canonical: "Grandpa",
    aliases: ["grandpa", "grandfather", "granddad", "gramps", "papaw"]
  },
  {
    canonical: "Grandma",
    aliases: ["grandma", "grandmother", "granny", "nana", "grammy"]
  },
  {
    canonical: "College Student",
    aliases: ["college student", "grad student", "student", "undergrad", "teen", "teenager", "young adult"]
  }
];

export const INTEREST_SYNONYMS: SynonymGroup[] = [
  {
    canonical: "WWII",
    aliases: [
      "wwii", "ww2", "world war ii", "world war 2", "second world war", "military history", 
      "normandy", "winston churchill", "aviation history", "spitfire", "battle of britain", 
      "d-day", "allied forces", "war history", "tank", "pacific theater", "codebreaking", "enigma"
    ]
  },
  {
    canonical: "Greek Mythology",
    aliases: [
      "greek mythology", "greek myth", "mythology", "greek gods", "olympians", "olympus",
      "zeus", "hades", "poseidon", "athena", "apollo", "achilles", "iliad", "odyssey", 
      "homer", "ancient greece", "mythological", "medusa", "pantheon", "roman mythology"
    ]
  },
  {
    canonical: "Filmmaking & Cinema",
    aliases: [
      "filmmaking", "filmmaker", "film maker", "director", "cinema", "movies", "cinematography",
      "screenwriting", "35mm", "analog film", "movie buff", "cinephile", "hollywood", 
      "film production", "clapperboard", "auteur", "editing", "film score"
    ]
  },
  {
    canonical: "Astronomy & Space",
    aliases: [
      "astronomy", "space", "cosmos", "astrophysics", "telescope", "nasa", "james webb",
      "hubble", "moon", "stars", "galaxies", "astrophysicist", "stargazing", "solar system",
      "planets", "nebula", "black hole", "celestial", "space exploration"
    ]
  },
  {
    canonical: "Cartography & Maps",
    aliases: [
      "cartography", "maps", "antique maps", "atlas", "geography", "navigation", 
      "topography", "navigational", "compass", "globes", "old maps", "nautical", "voyages"
    ]
  },
  {
    canonical: "Botany & Nature",
    aliases: [
      "botany", "plants", "gardening", "flora", "herbal", "nature", "plant lover", 
      "botanical", "horticulture", "houseplants", "herbalism", "wilderness", "foraging", "trees"
    ]
  },
  {
    canonical: "Literature & Writing",
    aliases: [
      "literature", "books", "reading", "writer", "novels", "classic literature", "poetry",
      "bookworm", "author", "stationery", "typewriter", "bibliophile", "book lover", "novelists"
    ]
  },
  {
    canonical: "Physics & Math",
    aliases: [
      "physics", "math", "mathematics", "quantum", "quantum physics", "relativity", "calculus",
      "equations", "einstein", "feynman", "theoretical physics", "geometry", "mathematician", "physicist"
    ]
  },
  {
    canonical: "Architecture & Design",
    aliases: [
      "architecture", "architect", "bauhaus", "blueprints", "buildings", "urban planning",
      "mid-century", "drafting", "structural", "industrial design", "graphic design", "golden ratio"
    ]
  },
  {
    canonical: "Coffee & Brewing",
    aliases: [
      "coffee", "espresso", "barista", "brewing", "roasting", "pour over", "chemex", 
      "caffeine", "single origin", "specialty coffee", "aeropress"
    ]
  },
  {
    canonical: "Tactile Mechanics",
    aliases: [
      "tactile mechanics", "tactile", "mechanics", "gears", "engineering", "mechanical",
      "brass", "machined", "precision", "desk toy", "kinetic", "horology", "fidget", "heavy brass"
    ]
  },
  {
    canonical: "Vintage Horology",
    aliases: [
      "horology", "vintage horology", "watches", "watchmaker", "timekeeping", "sundial",
      "mechanical watch", "chronometer", "timepieces", "pendulum", "escapement"
    ]
  },
  {
    canonical: "Geology & Earth",
    aliases: [
      "geology", "minerals", "crystals", "rocks", "earth science", "geologist", 
      "gemology", "volcanology", "meteorite", "tectonics"
    ]
  },
  {
    canonical: "Chess & Strategy",
    aliases: [
      "chess", "grandmaster", "strategy", "board games", "tactics", "chess player", 
      "checkmate", "strategic thinking", "game theory"
    ]
  },
  {
    canonical: "Paleontology & Fossils",
    aliases: [
      "paleontology", "fossils", "dinosaurs", "jurassic", "fossil", "archaeology", 
      "amber", "trilobite", "prehistoric", "ancient fossils"
    ]
  }
];

export const PERSONALITY_SYNONYMS: SynonymGroup[] = [
  {
    canonical: "Practical & Utilitarian",
    aliases: [
      "practical", "utilitarian", "functional", "useful", "not useless", "doesn't like useless stuff",
      "no junk", "no clutter", "minimal clutter", "usable", "everyday use", "workhorse", "durable"
    ]
  },
  {
    canonical: "Intellectual & Curious",
    aliases: [
      "intellectual", "curious", "nerdy", "geeky", "smart", "bookish", "academic", "deep thinker",
      "loves learning", "knowledge", "fascinated by how things work", "polymath"
    ]
  },
  {
    canonical: "Creative & Artistic",
    aliases: [
      "creative", "artistic", "visual", "crafty", "aesthetic", "designer", "maker", "storyteller"
    ]
  },
  {
    canonical: "Nostalgic & Historic",
    aliases: [
      "nostalgic", "historic", "vintage", "retro", "antique", "old school", "classic", "heritage",
      "archival", "traditional"
    ]
  },
  {
    canonical: "Refined & Discerning",
    aliases: [
      "refined", "discerning", "sophisticated", "elegant", "tasteful", "understated", "classy",
      "premium", "high quality", "luxury", "doesn't like cheap stuff"
    ]
  },
  {
    canonical: "Eccentric & Playful",
    aliases: [
      "unusual", "unique", "rare", "eccentric", "playful", "quirky", "distinctive", "one of a kind",
      "conversation starter", "weird", "unconventional", "novel"
    ]
  }
];

export const OCCASION_SYNONYMS: SynonymGroup[] = [
  {
    canonical: "Christmas & Holidays",
    aliases: ["christmas", "xmas", "holiday", "holidays", "secret santa", "stocking stuffer", "winter holiday"]
  },
  {
    canonical: "Father's Day",
    aliases: ["father's day", "fathers day", "father day"]
  },
  {
    canonical: "Mother's Day",
    aliases: ["mother's day", "mothers day", "mother day"]
  },
  {
    canonical: "Birthday",
    aliases: ["birthday", "bday", "turning 30", "turning 40", "turning 50", "turning 60", "turning 70"]
  },
  {
    canonical: "Anniversary",
    aliases: ["anniversary", "wedding anniversary", "years together"]
  },
  {
    canonical: "Retirement",
    aliases: ["retirement", "retiring", "retired", "farewell"]
  },
  {
    canonical: "Graduation",
    aliases: ["graduation", "grad", "graduating", "new job", "degree", "masters", "phd"]
  },
  {
    canonical: "Housewarming",
    aliases: ["housewarming", "new home", "new apartment", "new house"]
  },
  {
    canonical: "Thank You",
    aliases: ["thank you", "thanks", "appreciation", "gratitude"]
  }
];

export const PRODUCT_TYPE_SYNONYMS: SynonymGroup[] = [
  {
    canonical: "T-shirt",
    aliases: ["t-shirt", "tshirt", "tee", "shirt", "apparel"]
  },
  {
    canonical: "Hoodie",
    aliases: ["hoodie", "sweatshirt", "pullover", "sweater"]
  },
  {
    canonical: "Mug",
    aliases: ["mug", "coffee mug", "cup", "ceramic mug", "tea mug"]
  },
  {
    canonical: "Glassware",
    aliases: ["glass", "glassware", "whiskey glass", "rocks glass", "pint glass", "tumbler", "cocktail glass"]
  },
  {
    canonical: "Journal",
    aliases: ["journal", "notebook", "stationery", "diary", "field book", "grid notebook"]
  },
  {
    canonical: "Poster & Print",
    aliases: ["poster", "print", "wall art", "blueprint", "infographic", "framed print", "art print", "map print"]
  },
  {
    canonical: "Field Guide & Book",
    aliases: ["book", "field guide", "handbook", "atlas", "hardcover", "manual", "guide"]
  },
  {
    canonical: "Desk & Curiosity Object",
    aliases: ["desk object", "paperweight", "brass object", "curiosity", "sundial", "hourglass", "compass", "kaleidoscope", "puzzle", "kinetic"]
  },
  {
    canonical: "Water Bottle & Drinkware",
    aliases: ["water bottle", "flask", "thermos", "bottle"]
  }
];

export const NEGATIVE_PATTERNS = [
  /doesn['’]?t (?:like|want|need)\s+([^,.;]+)/i,
  /does not (?:like|want|need)\s+([^,.;]+)/i,
  /not\s+(?:a|an)?\s*([^,.;]+)/i,
  /no\s+(?:more\s+)?([^,.;]+)/i,
  /avoid\s+([^,.;]+)/i,
  /without\s+([^,.;]+)/i,
  /hate\s+([^,.;]+)/i
];

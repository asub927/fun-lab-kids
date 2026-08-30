export type VideoReference = {
  videoUrl: string;
  videoTitle: string;
  videoProvider: string;
};

/**
 * NC DPI–endorsed read-aloud resources (Digital Children's Reading Initiative).
 * Verified Storyline Online book pages — not lecture videos.
 */
export const STORYLINE_BOOKS = {
  emptyPot: "https://storylineonline.net/books/the-empty-pot/",
  arnie: "https://storylineonline.net/books/arnie-the-doughnut/",
  rentParty: "https://storylineonline.net/books/rent-party/",
  braveIrene: "https://storylineonline.net/books/brave-irene/",
  toBeDrum: "https://storylineonline.net/books/to-be-a-drum/",
  clark: "https://storylineonline.net/books/clark-the-shark/",
  enemyPie: "https://storylineonline.net/books/enemy-pie/",
  wilfrid: "https://storylineonline.net/books/wilfrid-gordon-mcdonald-partridge/",
  chestersWay: "https://storylineonline.net/books/chesters-way/",
} as const;

function storyline(slug: keyof typeof STORYLINE_BOOKS, title: string): VideoReference {
  return {
    videoUrl: STORYLINE_BOOKS[slug],
    videoTitle: title,
    videoProvider: "Storyline Online (NC DPI)",
  };
}

/** ELA read-aloud links keyed by standard — math/science use in-app strategies only */
export const ELA_READ_ALOUDS: Record<string, VideoReference> = {
  "RL.2.1": storyline("emptyPot", "The Empty Pot"),
  "RL.2.2": storyline("toBeDrum", "To Be a Drum"),
  "RL.2.3": storyline("braveIrene", "Brave Irene"),
  "RL.2.4": storyline("clark", "Clark the Shark"),
  "RL.2.5": storyline("arnie", "Arnie the Doughnut"),
  "RL.2.6": storyline("enemyPie", "Enemy Pie"),
  "RL.2.7": storyline("wilfrid", "Wilfrid Gordon McDonald Partridge"),
  "RL.2.9": storyline("chestersWay", "Chester's Way"),
  "RL.2.10": storyline("rentParty", "Rent Party Jazz"),
  "RI.2.1": storyline("wilfrid", "Wilfrid Gordon McDonald Partridge"),
  "RI.2.2": storyline("toBeDrum", "To Be a Drum"),
  "RI.2.3": storyline("braveIrene", "Brave Irene"),
  "RI.2.4": storyline("clark", "Clark the Shark"),
  "RI.2.5": storyline("arnie", "Arnie the Doughnut"),
  "RI.2.6": storyline("enemyPie", "Enemy Pie"),
  "RI.2.7": storyline("emptyPot", "The Empty Pot"),
  "RI.2.8": storyline("rentParty", "Rent Party Jazz"),
  "RI.2.9": storyline("chestersWay", "Chester's Way"),
  "RI.2.10": storyline("wilfrid", "Wilfrid Gordon McDonald Partridge"),
  "RF.2.4": storyline("arnie", "Arnie the Doughnut"),
  "RF.2.5": storyline("clark", "Clark the Shark"),
  "SL.2.2": storyline("braveIrene", "Brave Irene"),
  "SL.2.4": storyline("rentParty", "Rent Party Jazz"),
};

export function getVideoForStandard(standardCode: string, _activityType: string): VideoReference | null {
  return ELA_READ_ALOUDS[standardCode] ?? null;
}

export function allVideoReferences(): VideoReference[] {
  const seen = new Set<string>();
  return Object.values(ELA_READ_ALOUDS).filter((ref) => {
    if (seen.has(ref.videoUrl)) return false;
    seen.add(ref.videoUrl);
    return true;
  });
}

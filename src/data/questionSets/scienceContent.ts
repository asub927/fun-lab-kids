import type { ActivityParams } from "../activities";

type Triple = [ActivityParams, ActivityParams, ActivityParams];

function inquiry(
  prompts: [string, string, string],
  answers: [string, string, string],
): Triple {
  return [
    { scenario: "inquiry", prompt: prompts[0], answer: answers[0] },
    { scenario: "inquiry", prompt: prompts[1], answer: answers[1] },
    { scenario: "inquiry", prompt: prompts[2], answer: answers[2] },
  ];
}

/** Hand-authored science question sets keyed by standard code */
export const scienceQuestionSets: Record<string, Triple> = {
  "2.P.1.1": inquiry(
    [
      "What vibrates to make a guitar string sound?",
      "What vibrates when you hum a song?",
      "What part of a drum vibrates to make sound?",
    ],
    ["the guitar string vibrates", "your vocal cords vibrate", "the drum head vibrates"],
  ),
  "2.P.1.2": inquiry(
    [
      "What body part vibrates when you hear a loud noise?",
      "What body part vibrates when you speak?",
      "Why do your ears ring after a loud concert?",
    ],
    ["eardrum", "vocal cords", "eardrum vibrates"],
  ),
  "2.P.2.2": inquiry(
    [
      "Does water volume change when it freezes?",
      "Does ice weigh more or less than the same amount of liquid water?",
      "What happens to the shape of water when it freezes?",
    ],
    ["no volume change", "same weight", "becomes solid"],
  ),
  "2.P.2.3": inquiry(
    [
      "What happens to water in an open container over several days?",
      "What happens to water in a closed container over the same time?",
      "What process causes water to disappear from an open cup?",
    ],
    ["evaporates", "stays", "evaporation"],
  ),
  "2.E.1.1": inquiry(
    [
      "What source of energy warms the land during the day?",
      "What does the sun provide besides heat?",
      "Name one thing the sun's energy helps plants do.",
    ],
    ["sun", "light", "grow or photosynthesis"],
  ),
  "2.E.1.2": inquiry(
    [
      "Which tool measures wind speed?",
      "What do we call frozen rain that falls from clouds?",
      "Name two words we use to describe weather.",
    ],
    ["anemometer", "sleet or hail", "temperature and wind"],
  ),
  "2.E.1.3": inquiry(
    [
      "Is it usually warmer at noon or at midnight?",
      "Which season is typically warmest where you live?",
      "What weather pattern might you see every afternoon in summer?",
    ],
    ["noon", "summer", "afternoon storms or heat"],
  ),
  "2.E.1.4": inquiry(
    [
      "What tool measures temperature?",
      "What tool shows wind direction?",
      "What tool collects rain to measure precipitation?",
    ],
    ["thermometer", "weather vane", "rain gauge"],
  ),
  "2.L.1.1": inquiry(
    [
      "Name the four stages of an animal life cycle in order.",
      "What stage comes after birth?",
      "What stage comes before death?",
    ],
    ["birth adult reproduce death", "developing into adult", "aging"],
  ),
  "2.L.1.2": inquiry(
    [
      "Does a frog start life as an egg or an adult?",
      "How is a butterfly life cycle different from a mammal's?",
      "Name one animal whose young look different from adults.",
    ],
    ["egg", "metamorphosis", "frog or butterfly"],
  ),
  "2.L.2.1": inquiry(
    [
      "How might a puppy look like its parents?",
      "How might it look different?",
      "Name one behavior animals learn from parents.",
    ],
    ["same fur color or size", "different markings", "hunting or nesting"],
  ),
  "2.L.2.2": inquiry(
    [
      "Why are siblings in a family not exactly alike?",
      "What word means differences among related individuals?",
      "Give one example of variation in a litter of kittens.",
    ],
    ["different traits", "variation", "different colors or sizes"],
  ),
};

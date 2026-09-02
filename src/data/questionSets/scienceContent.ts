import type { ActivityParams } from "../activities";

type Sextuple = [
  ActivityParams,
  ActivityParams,
  ActivityParams,
  ActivityParams,
  ActivityParams,
  ActivityParams,
];

function inquiry(
  prompts: [string, string, string, string, string, string],
  answers: [string, string, string, string, string, string],
): Sextuple {
  return [
    { scenario: "inquiry", prompt: prompts[0], answer: answers[0] },
    { scenario: "inquiry", prompt: prompts[1], answer: answers[1] },
    { scenario: "inquiry", prompt: prompts[2], answer: answers[2] },
    { scenario: "inquiry", prompt: prompts[3], answer: answers[3] },
    { scenario: "inquiry", prompt: prompts[4], answer: answers[4] },
    { scenario: "inquiry", prompt: prompts[5], answer: answers[5] },
  ];
}

/** Hand-authored science question sets keyed by standard code (6 bases each). */
export const scienceQuestionSets: Record<string, Sextuple> = {
  "2.P.1.1": inquiry(
    [
      "What vibrates to make a guitar string sound?",
      "What vibrates when you hum a song?",
      "What part of a drum vibrates to make sound?",
      "What vibrates when you pluck a rubber band?",
      "What vibrates on a tuning fork to make a ping?",
      "What vibrates when you blow into a recorder?",
    ],
    [
      "the guitar string vibrates",
      "your vocal cords vibrate",
      "the drum head vibrates",
      "the rubber band vibrates",
      "the tuning fork vibrates",
      "the air column vibrates",
    ],
  ),
  "2.P.1.2": inquiry(
    [
      "What body part vibrates when you hear a loud noise?",
      "What body part vibrates when you speak?",
      "Why do your ears ring after a loud concert?",
      "What do sound waves travel through to reach your ears?",
      "Which sense organ helps you hear vibrations?",
      "What happens to sound when it enters the ear canal?",
    ],
    [
      "eardrum",
      "vocal cords",
      "eardrum vibrates",
      "air",
      "ears",
      "it makes the eardrum vibrate",
    ],
  ),
  "2.P.2.2": inquiry(
    [
      "Does water volume change when it freezes?",
      "Does ice weigh more or less than the same amount of liquid water?",
      "What happens to the shape of water when it freezes?",
      "What state is steam?",
      "What happens to ice when it melts?",
      "Can a solid turn into a liquid?",
    ],
    [
      "no volume change",
      "same weight",
      "becomes solid",
      "gas",
      "becomes liquid",
      "yes it melts",
    ],
  ),
  "2.P.2.3": inquiry(
    [
      "What happens to water in an open container over several days?",
      "What happens to water in a closed container over the same time?",
      "What process causes water to disappear from an open cup?",
      "Where does evaporated water go?",
      "Why might a puddle shrink on a sunny day?",
      "What can you do to slow evaporation from a cup?",
    ],
    [
      "evaporates",
      "stays",
      "evaporation",
      "into the air",
      "sun heat causes evaporation",
      "cover it",
    ],
  ),
  "2.E.1.1": inquiry(
    [
      "What source of energy warms the land during the day?",
      "What does the sun provide besides heat?",
      "Name one thing the sun's energy helps plants do.",
      "What happens to sidewalk temperature in bright sunlight?",
      "Why are sunny days often warmer than cloudy days?",
      "What energy from the sun helps Earth stay bright?",
    ],
    [
      "sun",
      "light",
      "grow or photosynthesis",
      "it gets warmer",
      "more sunlight reaches the ground",
      "light energy",
    ],
  ),
  "2.E.1.2": inquiry(
    [
      "Which tool measures wind speed?",
      "What do we call frozen rain that falls from clouds?",
      "Name two words we use to describe weather.",
      "What falls from clouds as liquid water?",
      "What do we call a very strong spinning storm over land?",
      "What kind of weather has lots of snow falling?",
    ],
    [
      "anemometer",
      "sleet or hail",
      "temperature and wind",
      "rain",
      "tornado",
      "snowstorm",
    ],
  ),
  "2.E.1.3": inquiry(
    [
      "Is it usually warmer at noon or at midnight?",
      "Which season is typically warmest where you live?",
      "What weather pattern might you see every afternoon in summer?",
      "Which season often has falling leaves?",
      "When is it usually cooler, early morning or mid-afternoon?",
      "What might stay similar across many summer days?",
    ],
    [
      "noon",
      "summer",
      "afternoon storms or heat",
      "fall or autumn",
      "early morning",
      "warm temperatures",
    ],
  ),
  "2.E.1.4": inquiry(
    [
      "What tool measures temperature?",
      "What tool shows wind direction?",
      "What tool collects rain to measure precipitation?",
      "What tool measures how fast the wind is blowing?",
      "What tool helps you see if the air pressure is changing?",
      "What do you look at to track weather over many days?",
    ],
    [
      "thermometer",
      "weather vane",
      "rain gauge",
      "anemometer",
      "barometer",
      "weather journal or chart",
    ],
  ),
  "2.L.1.1": inquiry(
    [
      "Name the four stages of an animal life cycle in order.",
      "What stage comes after birth?",
      "What stage comes before death?",
      "What do adults often do in a life cycle?",
      "What is the beginning stage for many animals?",
      "What changes as an animal grows from young to adult?",
    ],
    [
      "birth adult reproduce death",
      "developing into adult",
      "aging",
      "reproduce",
      "birth or egg",
      "size or body features",
    ],
  ),
  "2.L.1.2": inquiry(
    [
      "Does a frog start life as an egg or an adult?",
      "How is a butterfly life cycle different from a mammal's?",
      "Name one animal whose young look different from adults.",
      "What stage comes after a caterpillar?",
      "What does a tadpole become?",
      "What comes first in a butterfly life cycle?",
    ],
    [
      "egg",
      "metamorphosis",
      "frog or butterfly",
      "chrysalis or pupa",
      "frog",
      "egg",
    ],
  ),
  "2.L.2.1": inquiry(
    [
      "How might a puppy look like its parents?",
      "How might it look different?",
      "Name one behavior animals learn from parents.",
      "What is one trait a calf might inherit from a cow?",
      "Name one learned behavior a bird teaches its young.",
      "How can a kitten look similar to its mother?",
    ],
    [
      "same fur color or size",
      "different markings",
      "hunting or nesting",
      "coat color or size",
      "finding food or flying",
      "same fur color",
    ],
  ),
  "2.L.2.2": inquiry(
    [
      "Why are siblings in a family not exactly alike?",
      "What word means differences among related individuals?",
      "Give one example of variation in a litter of kittens.",
      "How can two plants from the same seed packet differ?",
      "What makes twins look similar but not identical?",
      "Name one way puppies in the same litter can vary.",
    ],
    [
      "different traits",
      "variation",
      "different colors or sizes",
      "different height or leaf shape",
      "same genes but small differences",
      "different spots or size",
    ],
  ),
};

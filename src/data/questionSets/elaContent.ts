import type { ActivityParams } from "../activities";

type Triple = [ActivityParams, ActivityParams, ActivityParams];

function reading(
  passages: [string, string, string],
  questions: [string, string, string],
  answers: [string, string, string],
): Triple {
  return [
    { passage: passages[0], question: questions[0], answer: answers[0] },
    { passage: passages[1], question: questions[1], answer: answers[1] },
    { passage: passages[2], question: questions[2], answer: answers[2] },
  ];
}

function writing(
  prompts: [string, string, string],
  frames: ["informative" | "narrative", "informative" | "narrative", "informative" | "narrative"],
  parts: [string[], string[], string[]],
): Triple {
  return [
    { frame: frames[0], prompt: prompts[0], requiredParts: parts[0] },
    { frame: frames[1], prompt: prompts[1], requiredParts: parts[1] },
    { frame: frames[2], prompt: prompts[2], requiredParts: parts[2] },
  ];
}

function language(
  sentences: [string, string, string],
  fixed: [string, string, string],
): Triple {
  return [
    { sentence: sentences[0], fixed: fixed[0] },
    { sentence: sentences[1], fixed: fixed[1] },
    { sentence: sentences[2], fixed: fixed[2] },
  ];
}

function checklist(items: [string[], string[], string[]]): Triple {
  return [
    { items: items[0], prompt: "Complete this step:" },
    { items: items[1], prompt: "Complete this step:" },
    { items: items[2], prompt: "Complete this step:" },
  ];
}

/** Hand-authored ELA question sets keyed by standard code */
export const elaQuestionSets: Record<string, Triple> = {
  "RL.2.1": reading(
    [
      "Sam walked his dog in the park. The dog chased a red ball near the pond.",
      "Lila packed a lunch and rode her bike to the lake. She arrived at noon.",
      "Ben lost his hat on the windy playground. He found it under the slide.",
    ],
    ["Who walked the dog?", "When did Lila arrive at the lake?", "Where did Ben find his hat?"],
    ["Sam", "noon", "under the slide"],
  ),
  "RL.2.2": reading(
    [
      "A tiny mouse helped a huge lion escape a net. The lion learned that small friends can be brave.",
      "Two goats met on a narrow bridge. They agreed to take turns and both crossed safely.",
      "A farmer planted seeds and waited. When the rain came, the crops grew tall.",
    ],
    ["What is the lesson of the mouse and lion story?", "What problem did the goats solve?", "What happened after the rain?"],
    ["small friends can help", "take turns", "crops grew"],
  ),
  "RL.2.3": reading(
    [
      "When the storm started, Ana grabbed her brother's hand and led him inside.",
      "The puppy chewed the shoe. Dad sighed and put the shoes on a high shelf.",
      "Mira fell off her scooter. She stood up, checked her knee, and tried again.",
    ],
    ["How did Ana respond to the storm?", "How did Dad respond to the puppy?", "What did Mira do after she fell?"],
    ["led him inside", "put shoes on shelf", "tried again"],
  ),
  "RL.2.4": reading(
    [
      "The rain went pitter-patter on the roof all night long.",
      "Zoom! The rocket raced across the dark sky.",
      "Whisper, whisper—the secret traveled from friend to friend.",
    ],
    ["What sound words describe the rain?", "What word shows the rocket's speed?", "How does whisper show volume?"],
    ["pitter-patter", "zoom", "quiet"],
  ),
  "RL.2.5": reading(
    [
      "First Mia planted beans. Next she watered them daily. Finally green sprouts appeared.",
      "The team lost the first game. In the middle they practiced hard. At the end they won.",
      "A cat napped in the sun. Then a bird landed nearby. Last the cat chased the bird.",
    ],
    ["What happened first with Mia's beans?", "What happened in the middle for the team?", "What happened last with the cat?"],
    ["planted", "practiced", "chased"],
  ),
  "RL.2.6": reading(
    [
      "Grandma loved the quiet garden. Tim wanted to play loud drums outside.",
      "The king wanted a feast. The cook wanted a simple soup for the sick child.",
      "Kay was scared of the dark. Her sister Jun enjoyed stargazing at night.",
    ],
    ["How are Grandma and Tim different?", "What do the king and cook want?", "How do Kay and Jun feel about night?"],
    ["quiet vs loud", "feast vs soup", "scared vs enjoys"],
  ),
  "RL.2.7": reading(
    [
      "The picture shows dark clouds and people holding umbrellas. The text says a storm is coming.",
      "An illustration shows roots under the soil. The caption explains plants drink water.",
      "The diagram shows a bike with labels for pedals, wheels, and handlebars.",
    ],
    ["What do the picture and text tell you about weather?", "What do the roots illustration and caption explain?", "What does the bike diagram help you learn?"],
    ["storm coming", "plants drink water", "bike parts"],
  ),
  "RL.2.9": reading(
    [
      "Version A: Cinderella leaves at midnight. Version B: Cinderella leaves when the clock strikes twelve.",
      "City Red Riding Hood takes a subway. Country Red Riding Hood walks a forest path.",
      "One Three Bears story ends with Goldilocks running away. Another ends with her apologizing.",
    ],
    ["How are the two Cinderella versions alike?", "How do settings differ in Red Riding Hood?", "How do the endings differ?"],
    ["midnight leave", "subway vs forest", "run vs apologize"],
  ),
  "RL.2.10": checklist([
    ["I read a story at my grade level for 10 minutes."],
    ["I retold the beginning, middle, and end of a story I read."],
    ["I asked a who or what question about a book I read."],
  ]),
  "RI.2.1": reading(
    [
      "Honeybees live in hives. Worker bees collect nectar from flowers.",
      "The Wright brothers tested planes in Kitty Hawk, North Carolina.",
      "Dolphins use clicks and whistles to communicate with each other.",
    ],
    ["Where do honeybees live?", "Where did the Wright brothers test planes?", "How do dolphins communicate?"],
    ["hives", "Kitty Hawk", "clicks and whistles"],
  ),
  "RI.2.2": reading(
    [
      "Paragraph 1: All about how seeds travel. Paragraph 2: Ways wind carries seeds. Paragraph 3: Animals spread seeds.",
      "Paragraph 1: Types of clouds. Paragraph 2: Cumulus clouds. Paragraph 3: Storm clouds.",
      "Paragraph 1: Healthy eating. Paragraph 2: Fruits and vegetables. Paragraph 3: Drinking water.",
    ],
    ["What is the main topic of the seed article?", "What does paragraph 2 focus on?", "What is paragraph 3 about?"],
    ["seeds travel", "cumulus clouds", "drinking water"],
  ),
  "RI.2.3": reading(
    [
      "First explorers mapped the coast. Then settlers built towns. Later railroads connected cities.",
      "Scientists observed the plant. They wrote notes. Finally they shared results.",
      "Mix flour and water. Stir the batter. Bake until golden.",
    ],
    ["What is the order of events for explorers?", "What steps did scientists follow?", "What is the first recipe step?"],
    ["map, build, railroad", "observe, write, share", "mix flour and water"],
  ),
  "RI.2.4": reading(
    [
      "The arctic fox has a thick coat to survive freezing temperatures.",
      "Migrate means to move from one place to another for the season.",
      "The shelter protected hikers from the harsh storm.",
    ],
    ["What does thick coat help the fox do?", "What does migrate mean?", "What did the shelter do?"],
    ["survive cold", "move for season", "protected hikers"],
  ),
  "RI.2.5": reading(
    [
      "Use the table of contents to find the chapter on reptiles.",
      "The bold heading says 'How Volcanoes Form.'",
      "A caption under the photo reads 'A bee on a sunflower.'",
    ],
    ["Which feature helps you find a chapter?", "What does the bold heading tell you?", "What does the caption describe?"],
    ["table of contents", "volcanoes form", "bee on sunflower"],
  ),
  "RI.2.6": reading(
    [
      "This poster wants you to recycle bottles and cans.",
      "The author explains how butterflies grow to teach readers about life cycles.",
      "The ad uses exciting words to convince you to try the new cereal.",
    ],
    ["What is the poster's purpose?", "Why does the author explain butterflies?", "What is the ad trying to do?"],
    ["recycle", "teach life cycles", "convince you to try cereal"],
  ),
  "RI.2.7": reading(
    [
      "A photo of cracked earth shows the land is very dry.",
      "A map with dark areas shows where the most rain falls.",
      "A cutaway drawing shows layers of soil under the grass.",
    ],
    ["What does the cracked earth photo show?", "What does the rain map show?", "What does the cutaway drawing show?"],
    ["dry land", "most rain", "soil layers"],
  ),
  "RI.2.8": reading(
    [
      "Exercise keeps your heart strong. It also helps you sleep better.",
      "Birds need clean water because dirty water can make them sick.",
      "Trees give shade, oxygen, and homes for animals.",
    ],
    ["Give one reason exercise helps.", "Why do birds need clean water?", "Name a reason trees are important."],
    ["strong heart", "dirty water sick", "shade or oxygen"],
  ),
  "RI.2.9": reading(
    [
      "Text A: Wolves hunt in packs. Text B: Wolves howl to communicate with the pack.",
      "Text A: Rain forests are wet and warm. Text B: Desert plants store water.",
      "Text A: Bikes need helmets. Text B: Skaters should wear pads.",
    ],
    ["What do both wolf texts say about packs?", "How are rain forest and desert different?", "What safety idea do both texts share?"],
    ["pack behavior", "wet vs dry", "wear protection"],
  ),
  "RI.2.10": checklist([
    ["I read an informational article at my grade level."],
    ["I found the main topic of an article I read."],
    ["I used a text feature like a heading or caption to find a fact."],
  ]),
  "RF.2.2": checklist([
    ["I wrote all uppercase letters A–Z neatly."],
    ["I wrote all lowercase letters a–z with correct size."],
    ["I copied a short sentence using legible spacing between words."],
  ]),
  "RF.2.3": checklist([
    ["I decoded a word with a long vowel team (like 'boat')."],
    ["I read a word with a silent letter (like 'knob')."],
    ["I blended a two-syllable word (like 'rabbit')."],
  ]),
  "RF.2.4": checklist([
    ["I read a page with few mistakes."],
    ["I reread a tricky sentence until it made sense."],
    ["I read with expression that matched the punctuation."],
  ]),
  "RF.2.5": checklist([
    ["I read aloud at a steady pace—not too fast."],
    ["I paused at periods and question marks."],
    ["I read a poem with rhythm and expression."],
  ]),
  "W.2.2": writing(
    ["Write about how plants grow.", "Write about your favorite animal.", "Write about why we recycle."],
    ["informative", "informative", "informative"],
    [
      ["topic", "fact", "conclusion"],
      ["topic", "fact", "conclusion"],
      ["topic", "fact", "conclusion"],
    ],
  ),
  "W.2.3": writing(
    ["Tell about a time you learned something new.", "Tell about a fun day with a friend.", "Tell about when you felt proud."],
    ["narrative", "narrative", "narrative"],
    [
      ["event", "detail", "feeling"],
      ["event", "detail", "feeling"],
      ["event", "detail", "feeling"],
    ],
  ),
  "W.2.4": checklist([
    ["I typed or wrote a draft using a digital tool or paper."],
    ["I saved or filed my writing where I can find it again."],
    ["I shared my writing with a partner for feedback."],
  ]),
  "W.2.5": checklist([
    ["I helped my group pick a research topic."],
    ["I found one fact from a book or trusted source."],
    ["I contributed a sentence to our shared writing."],
  ]),
  "W.2.6": writing(
    ["Answer: What did you learn on our field trip?", "Answer: What is one fact about your state?", "Answer: What did you observe outside today?"],
    ["informative", "informative", "informative"],
    [
      ["topic", "detail"],
      ["topic", "detail"],
      ["topic", "detail"],
    ],
  ),
  "SL.2.1": checklist([
    ["I listened while a partner spoke without interrupting."],
    ["I asked one question about a grade 2 topic in a group."],
    ["I agreed or politely disagreed with an idea and said why."],
  ]),
  "SL.2.2": checklist([
    ["I retold one key idea from a story read aloud."],
    ["I named the main character from a read-aloud."],
    ["I described one important event from a read-aloud."],
  ]),
  "SL.2.3": checklist([
    ["I asked the speaker a question to understand better."],
    ["I answered a question the speaker asked the class."],
    ["I repeated back something I heard to check I understood."],
  ]),
  "SL.2.4": checklist([
    ["I told a short story with a clear beginning and end."],
    ["I used at least one describing word in my story."],
    ["I spoke loudly enough for everyone to hear."],
  ]),
  "SL.2.5": checklist([
    ["I drew a picture that shows my idea clearly."],
    ["I labeled at least one part of my drawing."],
    ["I explained my picture to a partner."],
  ]),
  "SL.2.6": checklist([
    ["I spoke in a complete sentence when answering a question."],
    ["I used because to give a reason in a sentence."],
    ["I restated my idea in a full sentence, not a fragment."],
  ]),
  "L.2.1": language(
    ["the dog ran fast", "she goed to the store", "me and him went home"],
    ["The dog ran fast.", "She went to the store.", "He and I went home."],
  ),
  "L.2.2": language(
    ["what is your name", "the cat sat on the mat", "i like ice cream"],
    ["What is your name?", "The cat sat on the mat.", "I like ice cream."],
  ),
  "L.2.3": language(
    ["We gonna leave soon.", "The big dog is very large.", "Kids, please quiet down."],
    ["We are going to leave soon.", "The large dog is huge.", "Students, please be quiet."],
  ),
  "L.2.4": language(
    ["The bark on the tree was rough.", "I will bank the money.", "The bat flew at night."],
    ["The bark on the tree was rough.", "I will put the money in the bank.", "The bat flew at night."],
  ),
  "L.2.5": language(
    ["The happy puppy wagged its tail.", "The room was as cold as ice.", "She sprinted to the door."],
    ["The joyful puppy wagged its tail.", "The room was freezing.", "She ran quickly to the door."],
  ),
  "L.2.6": language(
    ["we learned about habitats today", "the word ecosystem is new to me", "pollination helps plants grow"],
    ["We learned about habitats today.", "The word ecosystem is new to me.", "Pollination helps plants grow."],
  ),
};

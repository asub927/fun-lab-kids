import {
  IES_COMPREHENSION_K3,
  NC_ELA_G2,
  NC_LIS_K2,
  NC_READING_INITIATIVE,
} from "../strategySources";
import type { CurriculumStrategy } from "./types";

/** NC LIS + IES WWC strategies keyed by ELA standard code */
export const ELA_STRATEGIES: Record<string, CurriculumStrategy> = {
  "RL.2.1": {
    strategy: "Questioning (IES) · 5W + H",
    strategySteps: [
      "Read once for fun. Read again to hunt for details.",
      "Match the question word: Who, What, Where, When, Why, or How.",
      "Find the sentence that answers it. Write a short answer in your own words.",
    ],
    strategySource: IES_COMPREHENSION_K3,
  },
  "RL.2.2": {
    strategy: "Summarizing · Find the lesson",
    strategySteps: [
      "Retell what happened to the characters.",
      "Ask: What did they learn or how did they change?",
      "State the lesson or moral in one clear sentence.",
    ],
    strategySource: IES_COMPREHENSION_K3,
  },
  "RL.2.3": {
    strategy: "Monitor & infer · Character response",
    strategySteps: [
      "Name the big event or problem in the story.",
      "Find what the character did or said in response.",
      "Describe how they felt and why they acted that way.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RL.2.4": {
    strategy: "Visualizing · Words that add meaning",
    strategySteps: [
      "Look for sound words, rhymes, or repeated phrases.",
      "Picture the scene in your mind — what do you see or hear?",
      "Explain how those words create feeling or rhythm.",
    ],
    strategySource: IES_COMPREHENSION_K3,
  },
  "RL.2.5": {
    strategy: "Story structure · Beginning, middle, end",
    strategySteps: [
      "Beginning: Who is in the story and where are they?",
      "Middle: What problem or main events happen?",
      "End: How does the story conclude?",
    ],
    strategySource: IES_COMPREHENSION_K3,
  },
  "RL.2.6": {
    strategy: "Compare viewpoints",
    strategySteps: [
      "Name each character's feelings or wishes.",
      "Notice how they see the same event differently.",
      "Compare their points of view in your own words.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RL.2.7": {
    strategy: "Text + illustrations",
    strategySteps: [
      "Study the illustration, diagram, or caption.",
      "Read the words on the page.",
      "Combine both to explain what you understand.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RL.2.9": {
    strategy: "Compare versions of a story",
    strategySteps: [
      "Notice what stays the same in both versions.",
      "Notice what is different — setting, details, or ending.",
      "Tell how they are alike and different.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RL.2.10": {
    strategy: "Independent reading · Monitor meaning",
    strategySteps: [
      "Pick a just-right book you can read smoothly.",
      "Stop when it doesn't make sense — reread or fix it up.",
      "Retell or answer a question about what you read.",
    ],
    strategySource: NC_LIS_K2,
  },
  "RI.2.1": {
    strategy: "Questioning · 5W + H for facts",
    strategySteps: [
      "Read the paragraph carefully.",
      "Use the question word to know what detail to find.",
      "Answer with a fact straight from the text.",
    ],
    strategySource: IES_COMPREHENSION_K3,
  },
  "RI.2.2": {
    strategy: "Summarizing · Main topic",
    strategySteps: [
      "Read the title and first sentence.",
      "Ask: What is this mostly about?",
      "Check each paragraph — does it support that topic?",
    ],
    strategySource: IES_COMPREHENSION_K3,
  },
  "RI.2.3": {
    strategy: "Sequence & connections",
    strategySteps: [
      "Look for time words: first, next, then, finally.",
      "Put events or steps in order.",
      "Explain how one step leads to the next.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RI.2.4": {
    strategy: "Context clues",
    strategySteps: [
      "Find the tricky word in the sentence.",
      "Read the sentences before and after for hints.",
      "Replace the word with a meaning that fits.",
    ],
    strategySource: NC_LIS_K2,
  },
  "RI.2.5": {
    strategy: "Text features (informational structure)",
    strategySteps: [
      "Scan headings, captions, bold words, and diagrams.",
      "Ask: Where would I find this fact quickly?",
      "Use the feature to locate the answer.",
    ],
    strategySource: IES_COMPREHENSION_K3,
  },
  "RI.2.6": {
    strategy: "Author's purpose",
    strategySteps: [
      "Ask: Is the author teaching, persuading, or entertaining?",
      "Find clue words that show the purpose.",
      "State why the author wrote this text.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RI.2.7": {
    strategy: "Images clarify the text",
    strategySteps: [
      "Study the photo, map, or diagram.",
      "Ask: What extra detail does the image add?",
      "Explain how the image helps you understand.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RI.2.8": {
    strategy: "Reasons & evidence",
    strategySteps: [
      "Find the main idea the author states.",
      "Look for because, so, or for example.",
      "Name a reason that supports the idea.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RI.2.9": {
    strategy: "Compare texts on one topic",
    strategySteps: [
      "Read both texts on the same topic.",
      "Find the most important point in each.",
      "Tell how the points are alike or different.",
    ],
    strategySource: NC_ELA_G2,
  },
  "RI.2.10": {
    strategy: "Informational reading · Monitor meaning",
    strategySteps: [
      "Choose an article you can read with few stops.",
      "Identify the main topic after each paragraph.",
      "Use text features to confirm key facts.",
    ],
    strategySource: NC_LIS_K2,
  },
  "RF.2.2": {
    strategy: "Handwriting (NC LIS)",
    strategySteps: [
      "Sit tall with feet flat.",
      "Form letters top to bottom.",
      "Space words evenly on the line.",
    ],
    strategySource: NC_LIS_K2,
  },
  "RF.2.3": {
    strategy: "Phonics decode",
    strategySteps: [
      "Look at the word pattern.",
      "Say each sound or syllable.",
      "Blend sounds into a word.",
    ],
    strategySource: NC_LIS_K2,
  },
  "RF.2.4": {
    strategy: "Fluency fix-up",
    strategySteps: [
      "Read in phrases, not word-by-word.",
      "If it sounds wrong, reread.",
      "Match your voice to punctuation.",
    ],
    strategySource: NC_LIS_K2,
  },
  "RF.2.5": {
    strategy: "Read aloud with expression",
    strategySteps: [
      "Preview the page first.",
      "Read at a steady pace.",
      "Use expression for characters.",
    ],
    strategySource: NC_LIS_K2,
  },
  "W.2.2": {
    strategy: "Informative writing",
    strategySteps: [
      "State your topic in one sentence.",
      "Give facts or definitions that support it.",
      "End with a closing sentence.",
    ],
    strategySource: NC_ELA_G2,
  },
  "W.2.3": {
    strategy: "Narrative writing · B-M-E",
    strategySteps: [
      "Beginning: What happened first?",
      "Middle: Add details — who, where, when.",
      "End: Share how you felt or how it ended.",
    ],
    strategySource: NC_ELA_G2,
  },
  "W.2.4": {
    strategy: "Digital publishing",
    strategySteps: [
      "Draft your writing.",
      "Save or store it safely.",
      "Share with a partner for feedback.",
    ],
    strategySource: NC_ELA_G2,
  },
  "W.2.5": {
    strategy: "Shared research",
    strategySteps: [
      "Pick a topic with your group.",
      "Find facts from a trusted source.",
      "Add your fact to the group project.",
    ],
    strategySource: NC_ELA_G2,
  },
  "W.2.6": {
    strategy: "Recall & write",
    strategySteps: [
      "Think about what you learned or saw.",
      "State the topic in one sentence.",
      "Add a supporting detail.",
    ],
    strategySource: NC_ELA_G2,
  },
  "SL.2.1": {
    strategy: "Collaborative talk",
    strategySteps: [
      "Listen without interrupting.",
      "Build on a partner's idea.",
      "Ask a question if you need clarity.",
    ],
    strategySource: NC_READING_INITIATIVE,
  },
  "SL.2.2": {
    strategy: "Recount aloud · Check for understanding",
    strategySteps: [
      "Listen for the main idea.",
      "Name key details.",
      "Retell in your own words.",
    ],
    strategySource: NC_READING_INITIATIVE,
  },
  "SL.2.3": {
    strategy: "Ask to clarify",
    strategySteps: [
      "Listen to the speaker.",
      "Ask a question if confused.",
      "Repeat back what you heard.",
    ],
    strategySource: NC_READING_INITIATIVE,
  },
  "SL.2.4": {
    strategy: "Tell a story aloud",
    strategySteps: [
      "Plan beginning, middle, end.",
      "Use describing words.",
      "Speak clearly for your audience.",
    ],
    strategySource: NC_ELA_G2,
  },
  "SL.2.5": {
    strategy: "Visual display",
    strategySteps: [
      "Draw the main idea.",
      "Label important parts.",
      "Explain your picture to someone.",
    ],
    strategySource: NC_ELA_G2,
  },
  "SL.2.6": {
    strategy: "Complete sentences",
    strategySteps: [
      "Start with a capital letter.",
      "Include a subject and verb.",
      "End with the right punctuation.",
    ],
    strategySource: NC_ELA_G2,
  },
  "L.2.1": {
    strategy: "Grammar check",
    strategySteps: [
      "Find the subject — who or what?",
      "Check the verb matches.",
      "Fix pronoun use (I, me, we, they).",
    ],
    strategySource: NC_ELA_G2,
  },
  "L.2.2": {
    strategy: "Capitalize & punctuate",
    strategySteps: [
      "Capitalize the first word and names.",
      "Add ending punctuation (. ? !).",
      "Check spelling of sight words.",
    ],
    strategySource: NC_ELA_G2,
  },
  "L.2.3": {
    strategy: "Formal vs informal language",
    strategySteps: [
      "Read the sentence aloud.",
      "Ask: Does this sound like school talk?",
      "Replace slang with clear words.",
    ],
    strategySource: NC_ELA_G2,
  },
  "L.2.4": {
    strategy: "Context clues · Multiple meanings",
    strategySteps: [
      "Read the whole sentence.",
      "Try each meaning of the word.",
      "Pick the meaning that fits best.",
    ],
    strategySource: NC_LIS_K2,
  },
  "L.2.5": {
    strategy: "Word relationships",
    strategySteps: [
      "Find the compare word (like, as).",
      "Ask: What two things are alike?",
      "Swap in a fresh synonym.",
    ],
    strategySource: NC_ELA_G2,
  },
  "L.2.6": {
    strategy: "Use new vocabulary",
    strategySteps: [
      "Recall a word from reading or talk.",
      "Use it in a complete sentence.",
      "Check that it fits the meaning.",
    ],
    strategySource: NC_ELA_G2,
  },
};

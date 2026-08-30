import { NC_SCIENCE_SEP } from "../strategySources";
import type { CurriculumStrategy } from "./types";

/** NC Science & Engineering Practices keyed by standard code */
export const SCIENCE_STRATEGIES: Record<string, CurriculumStrategy> = {
  "2.P.1.1": {
    strategy: "SEP · Observe vibrations",
    strategySteps: [
      "Observe: What is moving back and forth?",
      "Wonder: How does that movement make sound?",
      "Explain: Name the object that vibrates to produce the sound.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.P.1.2": {
    strategy: "SEP · Body parts & sound",
    strategySteps: [
      "Observe: What body part moves when you speak or hear?",
      "Connect: Vibrations travel to your ear.",
      "Explain: Name the eardrum or vocal cords and what they do.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.P.2.2": {
    strategy: "SEP · Compare & measure",
    strategySteps: [
      "Observe water before and after freezing.",
      "Compare: Did the volume or weight change?",
      "Explain using evidence from what you observed.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.P.2.3": {
    strategy: "SEP · Investigate over time",
    strategySteps: [
      "Compare an open container to a closed one over several days.",
      "Record what you notice about the water level.",
      "Explain: What process caused the change in the open container?",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.E.1.1": {
    strategy: "SEP · Energy from the sun",
    strategySteps: [
      "Observe: What does the sun provide besides light?",
      "Connect: How does that energy affect land, air, or water?",
      "Explain: Name one way the sun's energy helps living things.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.E.1.2": {
    strategy: "SEP · Describe weather conditions",
    strategySteps: [
      "Observe: temperature, wind, and precipitation.",
      "Use weather words: hot, cold, windy, rainy, sunny.",
      "Name a tool scientists use to measure one condition.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.E.1.3": {
    strategy: "SEP · Weather patterns",
    strategySteps: [
      "Compare weather at different times of day or year.",
      "Look for a pattern. What repeats?",
      "Explain when it is usually warmest or when storms happen.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.E.1.4": {
    strategy: "SEP · Weather tools",
    strategySteps: [
      "Ask: What do scientists measure about weather?",
      "Match each tool to what it measures (temperature, wind, rain).",
      "Name the tool and what it tells us.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.L.1.1": {
    strategy: "SEP · Life cycle model",
    strategySteps: [
      "Recall the stages: birth, grow, reproduce, age, death.",
      "Put the stages in order for one animal.",
      "Explain what happens at each stage.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.L.1.2": {
    strategy: "SEP · Compare life cycles",
    strategySteps: [
      "Observe how two animals change as they grow.",
      "Compare: What is alike? What is different?",
      "Explain one animal whose young look different from adults.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.L.2.1": {
    strategy: "SEP · Traits from parents",
    strategySteps: [
      "Observe an animal and its parents (or pictures).",
      "List traits that look the same and traits that differ.",
      "Explain one similarity and one difference.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
  "2.L.2.2": {
    strategy: "SEP · Variation among individuals",
    strategySteps: [
      "Observe siblings or related plants/animals.",
      "Notice ways they are alike but not exactly the same.",
      "Use the word variation to describe the differences.",
    ],
    strategySource: NC_SCIENCE_SEP,
  },
};

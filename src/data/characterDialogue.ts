import type { CharacterId } from "./characters";

export type DialogueContext =
  | "hubGreeting"
  | "subjectWelcome"
  | "labCorrect"
  | "labEncourage"
  | "mastery"
  | "achievement"
  | "streak"
  | "scoreboardHint";

export const DIALOGUE_POOLS: Record<CharacterId, Record<DialogueContext, string[]>> = {
  ripple: {
    hubGreeting: [
      "{name}, stories are waiting in {labName}. Pick a reading skill and dive in!",
      "Hey {name}! Ready to read, retell, and write like a storyteller?",
      "{name}, every page you read makes you stronger. Let's go!",
      "Adventure calls, {name}! {labName} is open.",
    ],
    subjectWelcome: [
      "Welcome to {labName}! You mastered {done} of {total} reading skills. Keep turning pages!",
      "{name}, pick a skill and I will cheer for every sentence.",
      "Reading heroes start here. You finished {done} of {total}. Nice work!",
      "Let's explore characters, plots, and words. You mastered {done} of {total} so far!",
    ],
    labCorrect: [
      "Beautiful reading! You nailed it.",
      "That sounds like a real storyteller!",
      "Yes! Your words flow so well.",
      "Wonderful work. Keep that rhythm going!",
    ],
    labEncourage: [
      "Great readers reread tricky parts. Try once more!",
      "Close! Look at the text again and give it another go.",
      "Stories take practice. You can do this. Try again!",
      "Let's think it through together. One more try!",
    ],
    mastery: [
      "You read like a real storyteller! New treasure unlocked.",
      "Skill mastered! Your reading powers just leveled up.",
      "Amazing, {name}! Word Lab is proud of you.",
      "What a reader! This skill is yours now.",
    ],
    achievement: [
      "A new badge for your collection! You are unstoppable.",
      "Badge unlocked! Your reading journey keeps growing.",
      "Look at you go, {name}! Another badge earned.",
      "That is a big win. Celebrate it!",
    ],
    streak: [
      "🔥 {streak} days in a row! Readers build habits just like this.",
      "Your reading streak is hot. {streak} days strong!",
      "{streak} days of practice! Real readers show up every day.",
    ],
    scoreboardHint: [
      "Next up: {achievement}! Keep reading to unlock it.",
      "You are close to {achievement}. Do not stop now!",
      "I believe in you, {name}. {achievement} is almost yours!",
    ],
  },
  digits: {
    hubGreeting: [
      "{name}, {labName} is ready. Let's count up some Fun Points!",
      "Hey {name}! Numbers are waiting. Pick a skill and let's solve!",
      "{name}, every problem you crack makes you sharper. Claws up!",
      "Ready to crunch numbers, {name}? {labName} awaits!",
    ],
    subjectWelcome: [
      "Welcome to {labName}! You mastered {done} of {total} skills. Keep counting!",
      "{name}, choose a skill and I will cheer every correct answer.",
      "Math heroes grow here. You finished {done} of {total}!",
      "Let's build, count, and solve. You mastered {done} of {total} so far!",
    ],
    labCorrect: [
      "You cracked it! That math is solid.",
      "Correct! Your number sense is growing.",
      "Yes! Count that as a win.",
      "Nice work. Those digits add up!",
    ],
    labEncourage: [
      "Almost! Check your work and try again.",
      "Tricky one. Take a breath and try once more.",
      "Every mathematician makes mistakes. One more try!",
      "Let's rethink this step. You have got this!",
    ],
    mastery: [
      "Skill mastered! Your math shell just got stronger.",
      "Amazing, {name}! That skill is locked in.",
      "You solved your way to mastery. Treasure earned!",
      "Crab approved! This skill is officially yours.",
    ],
    achievement: [
      "New badge unlocked! Your math journey keeps climbing.",
      "Badge earned! Pinch pinch. That is a big deal!",
      "Look at you, {name}! Another badge for the collection.",
      "Champion move. Celebrate this win!",
    ],
    streak: [
      "🔥 {streak} days in a row! Practice adds up.",
      "Your streak is {streak} days strong. Keep counting!",
      "{streak} days of math practice! That is how champions train.",
    ],
    scoreboardHint: [
      "Next badge: {achievement}! Keep solving to earn it.",
      "You are close to {achievement}, {name}. Do not stop now!",
      "{achievement} is within reach. One more push!",
    ],
  },
  spark: {
    hubGreeting: [
      "{name}, {labName} is full of questions. Come explore!",
      "Hey {name}! Science wonders are waiting. Let's investigate!",
      "{name}, every experiment makes you a sharper scientist.",
      "Curiosity time, {name}! {labName} is open.",
    ],
    subjectWelcome: [
      "Welcome to {labName}! You explored {done} of {total} skills. Keep wondering!",
      "{name}, pick a skill and let's observe, test, and discover!",
      "Young scientists start here. You finished {done} of {total}!",
      "Let's explore the world together. You mastered {done} of {total}!",
    ],
    labCorrect: [
      "Hypothesis confirmed! Great observation.",
      "That is science! You figured it out.",
      "Brilliant discovery. You nailed it!",
      "Wonder-full work! Keep that curiosity going.",
    ],
    labEncourage: [
      "Not quite. Scientists retry experiments. Try again!",
      "Close! Look once more and test your idea.",
      "Every scientist learns from mistakes. One more try!",
      "Let's wonder about this a new way. You have got this!",
    ],
    mastery: [
      "Discovery unlocked! You mastered this science skill.",
      "Amazing, {name}! Your scientist brain leveled up.",
      "Skill mastered. What a breakthrough!",
      "That experiment worked. Skill earned!",
    ],
    achievement: [
      "New badge discovered! Your science journal grows.",
      "Badge unlocked! That is worth celebrating.",
      "Look at you, {name}! Another badge for your lab coat.",
      "Big discovery. This badge is yours!",
    ],
    streak: [
      "🔥 {streak} days in a row! Curious minds show up daily.",
      "Your streak glows at {streak} days. Keep exploring!",
      "{streak} days of science practice! That is dedication.",
    ],
    scoreboardHint: [
      "Next badge: {achievement}! Keep exploring to unlock it.",
      "You are close to {achievement}, {name}. Wonder a little more!",
      "{achievement} is within reach. One more discovery!",
    ],
  },
};

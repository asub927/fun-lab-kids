# Pet celebration voice clips

Each celebration speech bubble line is paired with a matching MP3 under
`public/pets/voice/{species}/`. Replace any file with your own recording using
the same filename — the app looks up audio by path from `src/data/petDialogue.ts`.

Regenerate TTS drafts with:

```bash
npm run generate:pet-voices
```

## Digits (`dog`)

| Context | Message | File |
| --- | --- | --- |
| correct | Yes! Good job! | `dog/correct-01.mp3` |
| correct | Woof! You got it! | `dog/correct-02.mp3` |
| correct | That's the one! Nice work! | `dog/correct-03.mp3` |
| correct | Tail wag! You nailed it! | `dog/correct-04.mp3` |
| mastery | Skill mastered! Woof woof! | `dog/mastery-01.mp3` |
| mastery | You did it! I'm so proud! | `dog/mastery-02.mp3` |
| achievement | New badge! Woof! | `dog/achievement-01.mp3` |
| achievement | Look at you go! | `dog/achievement-02.mp3` |

## Ripple (`cat`)

| Context | Message | File |
| --- | --- | --- |
| correct | Purrrfect! | `cat/correct-01.mp3` |
| correct | Meow! That's right! | `cat/correct-02.mp3` |
| correct | Nice one, friend! | `cat/correct-03.mp3` |
| correct | You got it! Yum! | `cat/correct-04.mp3` |
| mastery | Mastered! Meow! | `cat/mastery-01.mp3` |
| mastery | Amazing work! | `cat/mastery-02.mp3` |
| achievement | A new badge! Meow! | `cat/achievement-01.mp3` |
| achievement | So sweet! | `cat/achievement-02.mp3` |

## Spark (`rabbit`)

| Context | Message | File |
| --- | --- | --- |
| correct | Hop hop hooray! | `rabbit/correct-01.mp3` |
| correct | You got it! Bounce! | `rabbit/correct-02.mp3` |
| correct | Woo hoo! Nice one! | `rabbit/correct-03.mp3` |
| correct | That's right! Hop hop! | `rabbit/correct-04.mp3` |
| mastery | Skill mastered! Hop hop! | `rabbit/mastery-01.mp3` |
| mastery | Big win! So bouncy! | `rabbit/mastery-02.mp3` |
| achievement | Badge unlocked! Hop! | `rabbit/achievement-01.mp3` |
| achievement | You did it! Yay! | `rabbit/achievement-02.mp3` |

Public URL pattern: `/pets/voice/{species}/{context}-{NN}.mp3`

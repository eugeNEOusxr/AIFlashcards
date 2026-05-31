import type { Lesson } from "./curriculumTypes";
import { phasedMcqQuestions } from "./legacyMcq";

export const wavesChapter1: Lesson[] = [
  {
    id: "waves-lesson-1-intro",
    title: "Lesson 1: What is a Wave?",
    explanation:
      "A wave transfers energy without transferring matter. Particles oscillate about equilibrium while the disturbance travels. Mechanical waves need a medium; electromagnetic waves do not.",
    visualKeywords: ["wave", "oscillation", "energy transfer", "medium"],
    conceptTags: ["wave", "oscillation", "medium"],
    visualTheme: {
      backgroundScene: "contact_fields",
      accentColors: ["cyan", "violet"],
      motifs: ["field-lines", "motion-trail"],
    },
    reinforcementFeedback: {
      correct: "You distinguished wave motion from bulk matter flow.",
      incorrect: "Remember: the medium vibrates, but matter is not transported with the wave.",
    },
    questions: phasedMcqQuestions("physics.waves.intro", [
      {
        prompt: "A wave transfers:",
        options: ["Matter only", "Energy", "Mass", "Temperature only"],
        correctIndex: 1,
      },
      {
        id: "wv2",
        prompt: "Sound is an example of:",
        options: ["Electromagnetic wave", "Mechanical wave", "Static field", "Particle decay"],
        correctIndex: 1,
      },
      {
        id: "wv3",
        prompt: "In a wave, particles generally:",
        options: ["Travel with the wave forever", "Oscillate about a point", "Stop moving", "Gain mass"],
        correctIndex: 1,
      },
    ]),
  },
  {
    id: "waves-lesson-2-properties",
    title: "Lesson 2: Frequency & Wavelength",
    explanation:
      "Frequency is how many oscillations per second (hertz). Wavelength is distance between matching points on adjacent waves. Wave speed equals frequency times wavelength: v = fλ.",
    visualKeywords: ["frequency", "wavelength", "hertz", "wave speed"],
    conceptTags: ["frequency", "wavelength", "wave speed"],
    reinforcementFeedback: {
      correct: "Good use of v = fλ.",
      incorrect: "Check v = fλ — speed links frequency and wavelength.",
    },
    questions: phasedMcqQuestions("physics.waves.properties", [
      {
        prompt: "The unit of frequency is:",
        options: ["Metres", "Hertz", "Newtons", "Joules"],
        correctIndex: 1,
      },
      {
        id: "wv5",
        prompt: "Wave speed equals:",
        options: ["f + λ", "f × λ", "f ÷ λ", "λ − f"],
        correctIndex: 1,
      },
      {
        id: "wv6",
        prompt: "If frequency increases and speed is constant:",
        options: ["Wavelength increases", "Wavelength decreases", "Speed doubles", "Energy vanishes"],
        correctIndex: 1,
      },
    ]),
  },
  {
    id: "waves-lesson-3-em",
    title: "Lesson 3: Electromagnetic Spectrum",
    explanation:
      "Electromagnetic waves span radio to gamma rays. All travel at the same speed in vacuum. Different wavelengths interact with matter differently — visible light, infrared heat, ultraviolet damage.",
    visualKeywords: ["EM spectrum", "visible light", "infrared", "ultraviolet"],
    conceptTags: ["electromagnetic", "spectrum", "light"],
    reinforcementFeedback: {
      correct: "Spectrum order and speed in vacuum are key ideas.",
      incorrect: "All EM waves travel at c in vacuum; wavelength and frequency vary.",
    },
    questions: phasedMcqQuestions("physics.waves.em", [
      {
        prompt: "All EM waves in vacuum travel at:",
        options: ["Different speeds", "The same speed", "Zero speed", "Sound speed"],
        correctIndex: 1,
      },
      {
        id: "wv8",
        prompt: "Visible light sits between:",
        options: ["Radio and microwave", "Infrared and ultraviolet", "X-ray and gamma only", "Sound and ultrasound"],
        correctIndex: 1,
      },
      {
        id: "wv9",
        prompt: "Higher frequency EM waves generally have:",
        options: ["Longer wavelength", "Shorter wavelength", "No energy", "More mass"],
        correctIndex: 1,
      },
    ]),
  },
];

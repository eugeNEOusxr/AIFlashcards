# Physics visual asset library

Drop WebP/PNG scenes here for automatic loading. CSS motifs render as fallback when files are missing.

## Structure

```
force_motion/
  bg.webp          — background chamber
  mid.webp         — optional midground (bowling ball scene)
contact_fields/
  bg.webp
inertia_ice/
  bg.webp
f_equals_ma/
  bg.webp
force_applications/
  bg.webp
```

Scene IDs match `visualTheme.backgroundScene` in `src/content/physicsChapter1.ts`.

# LernHeld Design Specification

This document outlines the visual direction, wireframes, and the robot mascot for the LernHeld application.

## 1. Visual Identity
- **Colors**: OKLCH-based palette (Primary: Blue, Secondary: Yellow, Background: Paper-White).
- **Icons**: Lucide icons configured with `stroke-width: 2.5px`.
- **Atmosphere**: Playful, clear, and high-contrast for accessibility.

---

## 2. Wireframes (Markdown)

### Home-Screen (Spielplan-Optik)
```text
+-------------------------------------------------------------+
| [Avatar]          LERNHELD - WELT         [Stats: ⭐ 12]    |
+-------------------------------------------------------------+
|                                                             |
|       ( Start )                                             |
|           \                                                 |
|          [ 1 ] --- [ 2 ] --- [ 3 ]                          |
|                                \                            |
|          [ 6 ] --- [ 5 ] --- [ 4 ]                          |
|            /                                                |
|       [ Boss ]                                              |
|                                                             |
+-------------------------------------------------------------+
| [🏠 Home]       [📚 Mathe]        [✍️ Deutsch]    [⚙️ Setup] |
+-------------------------------------------------------------+
```
*Layout Notes: The path is rendered as a CSS-drawn line. Buttons are large, bulbous circles with tactile hover effects.*

### Mathe-Hunderterfeld
```text
+-------------------------------------------------------------+
| 10 x 10 GRID (1-100)                                        |
+-------------------------------------------------------------+
| [ 1][ 2][ 3][ 4][ 5][ 6][ 7][ 8][ 9][10]                    |
| [11][12][13] ...                                            |
| ...                                                         |
| [91][92][93][94][95][96][97][98][99][100]                   |
+-------------------------------------------------------------+
| Prompt: "Finde die Zahl 42!"                                |
+-------------------------------------------------------------+
```
*Layout Notes: Each cell is a square button. Highlights appear on hover or when multiple of 5/10 are shown.*

### Deutsch-Silbenleser
```text
+-------------------------------------------------------------+
| [  RO  ]      +      [  BOT  ]      =      [ ROBOT ]        |
| (Slot 1)            (Slot 2)              (Result)          |
+-------------------------------------------------------------+
| [<- Prev]                                      [Next ->]    |
+-------------------------------------------------------------+
```
*Layout Notes: Syllables are shown in extra-large font sizing. Colored underlines help distinguish syllable boundaries (Sprechsilben).*

---

## 3. Lernheld-Robot SVG Structure

The robot is a modular SVG character. Its state is controlled via CSS classes or props.

### Base Paths (Example Structure)
```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="robot-base">
  <!-- Body -->
  <rect x="50" y="70" width="100" height="80" rx="20" fill="var(--color-primary)" />
  <!-- Head -->
  <rect x="65" y="30" width="70" height="50" rx="15" fill="var(--color-primary)" />
  <!-- Antenna -->
  <line x1="100" y1="10" x2="100" y2="30" stroke="var(--color-secondary)" stroke-width="4" />
  <circle cx="100" cy="10" r="5" fill="var(--color-secondary)" />
</svg>
```

### States

| State | CSS/Path Modification | Visual Change |
| :--- | :--- | :--- |
| **Neutral** | `.robot-eyes: { r: 5 }` | Standard gaze, arms at side. |
| **Jubelnd** | `.robot-arms: { transform: translateY(-20px) }` | Arms raised, eyes become stars or wide arcs. |
| **Hilfsbereit** | `.robot-arm-right: { rotation: 45deg }` | Pointing gesture, slight head tilt. |

---

## 4. Implementation Details
- All interactive components should use `shadow-soft` and `radius-xl`.
- Typography: Headers in *Outfit*, Body in *Inter*.

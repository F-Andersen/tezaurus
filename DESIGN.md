# Design System: The Curated Path

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Concierge"**

This design system is not a mere repository of components; it is a high-end editorial framework designed to feel like a bespoke travel journal or a luxury concierge service. We achieve a refined balance by moving beyond the "template" look, focusing on **intentional compositions** and **structured breathing room**.

The goal is "Quiet Luxury." We achieve this through:
*   **High-Contrast Scale:** Dramatic differences between oversized serif displays and functional sans-serif body text.
*   **Purposeful Whitespace:** Space is used as a balanced material to frame content, ensuring a clean, accessible layout without being overly sparse.
*   **Organic Layering:** UI elements should feel like heavy cardstock or vellum layered on a gallery wall, rather than flat pixels on a screen.

---

## 2. Colors & Tonal Depth
The palette transitions from the warmth of a sun-bleached villa (`background: #F9F8F5`) to the sophisticated depths of a midnight harbor (`primary: #243a64`).

### The Palette
*   **Base:** `background: #F9F8F5`. This off-white base provides a softer, more premium feel than pure white.
*   **Primary (Deep Navy):** `#243a64`. Used for high-authority elements and deep contrast.
*   **Secondary (Sage/Mint):** `#A8C6B1`. Used for environmental accents and subtle call-outs.
*   **Tonal Surfaces:** Utilizing neutral and tertiary tones (`#D1E0D7`) to create sophisticated hierarchy.

### Signature Rules
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Definition must be achieved through background shifts. For example, a destination gallery should sit directly on the `background` without a stroke, using tonal shifts to define boundaries.
*   **Surface Nesting:** Create depth by stacking. Place a lighter surface card inside a slightly darker container section. This creates a "soft lift" that feels architectural.
*   **The Glass & Gradient Rule:** For floating navigation or hero overlays, use Glassmorphism. Apply `surface` colors at 70% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs, do not use flat navy. Apply a subtle linear gradient from `primary (#243a64)` to a slightly lighter variant at a 135-degree angle to add "soul" and dimension.

---

## 3. Typography
The interplay between **Noto Serif** and **Manrope** creates a dialogue between tradition and modernity.

*   **Display (Noto Serif):** Use `display-lg (3.5rem)` for hero titles. Tighten the letter-spacing by `-0.02em` to give it a "printed" editorial feel.
*   **Headlines (Noto Serif):** Use for destination names and section headers. These should always maintain high contrast against the surface.
*   **Body (Manrope):** Use `body-lg (1rem)` for descriptions. Manrope’s geometric clarity ensures legibility against the ornate Serif headings. Maintain a clean line-height for a professional reading experience.
*   **Labels (Manrope):** Use `label-md (0.75rem)` in All Caps with `0.1em` letter-spacing for metadata (e.g., "7 NIGHTS • MALDIVES").

---

## 4. Elevation & Depth
In this system, elevation is a whisper, not a shout.

*   **Tonal Layering:** Hierarchy is achieved by moving up the surface scale. The "highest" tier represents the element closest to the user.
*   **Ambient Shadows:** If a card must float (e.g., a booking modal), use a shadow color derived from the primary/neutral darks at 5% opacity, with a soft blur. It should look like a soft glow of light, not a drop shadow.
*   **The "Ghost Border":** If a button or input requires a boundary for accessibility, use a very low opacity stroke. It must be barely perceptible.
*   **Motion Depth:** When elements hover, prioritize background color transitions over Y-axis movement to maintain the grounded, "paper" aesthetic.

---

## 5. Components

### Buttons
*   **Primary:** Navy gradient (based on `#243a64`), `MODERATE (0.5rem)` rounded corners, white text.
*   **Secondary:** Sage base (`#A8C6B1`), no shadow, dark text.
*   **Tertiary (Editorial):** Underlined `label-md` text with no container. The underline should be 1px and sit `4px` below the baseline.

### Cards & Collections
*   **Editorial Cards:** Forbid dividers. Use balanced vertical whitespace (Level 2 spacing) between text blocks and images.
*   **Images:** Use moderate (`0.5rem - 1rem`) corner radius. All travel imagery should have a slight desaturation to match the `off-white` and `sage` palette.

### Inputs & Search
*   **The "Concierge Search":** Large, borderless input fields using `display-sm` typography. The focus state is indicated by a "Ghost Border" appearing at 20% opacity and a subtle shift in the surface background.

### Signature Component: The "Vellum Overlay"
*   A semi-transparent card (surface at 80% opacity + backdrop blur) that partially overlaps an image. This breaks the grid and creates the "layered paper" aesthetic essential to high-end editorial design.

---

## 6. Do's and Don'ts

### Do
*   **Do** use intentional margins. While balanced, ensure there is clear hierarchy between the gutter and the content block.
*   **Do** use subtle background highlights behind botanical or nature-focused content using the tertiary palette (`#D1E0D7`).
*   **Do** ensure all interactive elements have a minimum `44px` touch target, despite the minimalist look.

### Don't
*   **Don't** use pure black `#000000`. It is too harsh for the "luxury concierge" vibe. Use the `primary` navy or deep neutral tones.
*   **Don't** use hard `9999px` (pill) shapes for buttons or inputs. The system uses moderate rounding (`roundedness: 2`) to maintain a sophisticated architectural feel.
*   **Don't** use standard dividers. If you feel the need for a line, utilize the balanced spacing system to create separation. Space is your separator.
# Design System Documentation: High-End Editorial Medical Travel

## 1. Overview & Creative North Star
**Creative North Star: "The Clinical Curator"**

This design system rejects the clinical coldness of traditional healthcare and the cluttered urgency of budget travel sites. Instead, it adopts the persona of a "Clinical Curator"—an authoritative yet serene guide. The aesthetic is rooted in **High-End Editorial** design: imagine a premium wellness magazine met with the precision of a Swiss laboratory.

To break the "template" look, we prioritize intentional asymmetry and breathing room. We do not fill the screen; we compose it. By utilizing extreme typographic scales and overlapping layers, we create a sense of bespoke craftsmanship. The interface should feel less like a software application and more like a high-touch, concierge invitation.

---

## 2. Color Philosophy & Surface Logic

The palette is a sophisticated monochromatic exploration of teal and cyan, designed to evoke trust (medical) and tranquility (travel).

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections. Boundaries must be established through tonal transitions.
- Use `surface_container_low` sections against the `surface` background to define content blocks.
- Transition from `primary_container` (#0F3C49) to `surface` to signal a shift in intent.

### Surface Hierarchy & Nesting
We treat the UI as a physical arrangement of fine paper and frosted glass.
- **Base Level:** `surface` (#F7FAFB) – The "canvas."
- **Nesting Tiers:** Use `surface_container` tokens to create depth. A `surface_container_lowest` (#FFFFFF) card should sit on a `surface_container_low` (#F1F4F5) section. This "paper-on-top-of-paper" approach provides structure without visual noise.

### The "Glass & Gradient" Rule
To elevate the experience beyond flat design:
- **Floating Elements:** Use **Glassmorphism** for navigation bars or floating action panels. Apply a semi-transparent `surface` color with a 20px+ `backdrop-blur`.
- **Signature Textures:** Apply subtle linear gradients (e.g., `primary` to `primary_container`) to Hero backgrounds and Primary CTAs. This creates "visual soul," preventing the teal from feeling stagnant or flat.

---

## 3. Typography: The Editorial Voice

The contrast between **Noto Serif** and **Manrope** is the heartbeat of this system.

- **The Authority (Noto Serif):** Used for all `display` and `headline` roles. It signals heritage and medical expertise. Use `display-lg` (3.5rem) with generous leading to create an "Editorial Cover" feel on landing pages.
- **The Precision (Manrope):** Used for `title`, `body`, and `label` roles. Its geometric clarity balances the serif's traditionalism.
- **Tracking:** For `label-sm` and `label-md`, increase letter-spacing by 3-5% to enhance the premium, "spaced-out" luxury feel.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than structural lines.

### The Layering Principle
Depth is achieved by "stacking" the surface tiers. 
- **Example:** Place a medical expert's profile card (`surface_container_lowest`) inside a filtered results area (`surface_container_low`). The 2-4% difference in luminosity provides all the separation the eye needs.

### Ambient Shadows
Shadows are never "grey." They are tinted.
- **Token:** Use a shadow color derived from `on_surface` at 4-8% opacity.
- **Execution:** Shadows must be extra-diffused. For a floating card, use a 40px to 60px blur with 0px offset. It should feel like a soft glow of light, not a drop shadow.

### The "Ghost Border" Fallback
If accessibility requirements demand a border (e.g., in a high-density data table):
- **Rule:** Use `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Buttons
- **Primary:** `primary_container` background with `on_primary` text. Apply a subtle 10% vertical gradient to give it a "pressed paper" feel.
- **Secondary:** Transparent background with an `outline_variant` "Ghost Border" (20% opacity). 
- **Rounding:** Strictly `lg` (1rem / 16px) for a soft, approachable medical feel.

### Cards & Lists
- **The Separation Rule:** Forbid the use of divider lines. Separate list items using `body-lg` spacing or by alternating backgrounds between `surface` and `surface_container_low`.
- **Images:** Any imagery (hospitals, destinations) must use the `xl` (1.5rem) corner radius to match the soft editorial aesthetic.

### Input Fields
- Avoid the "boxed" look. Use a `surface_container_high` background with a bottom-only "Ghost Border."
- Helper text should use `label-md` in `on_surface_variant` for a muted, sophisticated secondary read.

### Signature Component: The Concierge Card
A bespoke component for this system: A `tertiary_container` card with a 15% opacity `secondary` tint. It uses `display-sm` for a quote or highlight and overlaps the section boundary to break the grid.

---

## 6. Do’s and Don’ts

### Do
- **Do** use massive amounts of whitespace. If you think there is enough space, double it.
- **Do** overlap elements. Place a small image or a "Floating Detail" card so it sits half-on and half-off a background container.
- **Do** use `secondary` (#1B7483) sparingly as a "surgical strike" color—only for the most important interactive elements.

### Don’t
- **Don't** use pure black (#000000). Always use `on_surface` (#181C1D) for text.
- **Don't** use standard "drop shadows." If the element doesn't feel like it's floating in a soft, lit room, the shadow is too harsh.
- **Don't** use icons with varying line weights. Use thin, 1.5pt stroke icons to match the Manrope font weight.
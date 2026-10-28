# Design: Theme and color

> Part of the design system; index and routing table in [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).
> Section numbers stay as in the original because comments in the code point to "mục N".

## 1. Theme structure

Two **independent** axes, the user picks each one separately:

- **Theme:** a color identity; each theme has its own name and spirit — Minimalist Editorial, Digital Garden, and later themes.
- **Mode:** Light, Dark, or Hệ thống (follows the device setting). Mode is not hard-wired to a theme.

Because the two axes are independent, the number of combinations is **not fixed**: each theme only needs to define its own light and dark palettes.

The theme and mode are applied to `<html>` with two attributes, plus the stored mode preference:

```html
<html data-theme="minimalist-editorial" data-mode="dark" data-mode-preference="dark"></html>
```

`data-mode` is the resolved mode (`light` or `dark`); `data-mode-preference` keeps the user's choice
(`light`, `dark` or `system`) so it survives navigation.

How to extend: adding a new theme = adding a palette to this file (`docs/design/theme.md`) + adding a CSS variables block for that theme + registering it in `portal/src/data/themes.ts`. Layout and typography do **not** change per theme; only color changes.

### Implementation scope

- **Current phase:** only **Minimalist Editorial** is implemented (full light + dark). The theme selector hides itself when only one theme is available, and shows itself again when there are two or more.
- **Later:** Digital Garden and other themes. The Digital Garden palette is documented in section 2.2 but is **not yet** in the code.

## 2. Theme palettes

### 2.1 Minimalist Editorial — implemented

**Mood:** warm, calm, like a personal technical journal.

| Token           | Dark      | Light     |
| --------------- | --------- | --------- |
| Background      | `#171614` | `#F7F4ED` |
| Surface         | `#24221F` | `#FFFCF6` |
| Primary text    | `#F2EBDD` | `#292720` |
| Secondary text  | `#B6ADA0` | `#756F64` |
| Accent          | `#A6B58A` | `#667A4D` |
| Links           | `#83B9D4` | `#326C8A` |
| Borders         | `#3A3630` | `#E3DDD1` |
| Scrollbar thumb | `#565046` | `#C9C1B1` |

### 2.2 Digital Garden — not implemented

**Mood:** quiet, natural, like a garden of knowledge.

| Token          | Dark      | Light     |
| -------------- | --------- | --------- |
| Background     | `#111A18` | `#F1F5EF` |
| Surface        | `#1C2723` | `#FAFCF8` |
| Primary text   | `#E7E8D9` | `#26332B` |
| Secondary text | `#A5B2A6` | `#647469` |
| Accent         | `#A8C3A0` | `#547A58` |
| Links          | `#8CBFC0` | `#347779` |
| Borders        | `#34423A` | `#D8E2D7` |

## 3. CSS variables

Token names are shared by every theme and every mode; only the values change per `data-theme` + `data-mode` pair. The real values live in `portal/src/styles/tokens.css` and **must match the table in section 2** (the table decides, the CSS file implements; to change a color, edit the table first). The full CSS block is not copied here to avoid drift.

- Color tokens: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`,
  `--color-link`, `--color-border`, `--color-scrollbar-thumb`.
- Selector form `:root[data-theme='<id>'][data-mode='dark' | 'light']`. `:root` carries the dark values of
  Minimalist Editorial as the default, so the page stays readable before JavaScript runs.
- To add a theme, add two blocks of the same shape with the selector `[data-theme='<id>']`, values taken from the table in section 2.
- When the mode is "Hệ thống", JavaScript reads `prefers-color-scheme` and sets `data-mode` accordingly.
- Do not hard-code colors in components.

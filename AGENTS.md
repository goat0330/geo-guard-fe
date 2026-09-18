# geo-guard-fe UI Agent Rules

Before changing any UI, read:

1. `design-system/DESIGN.md`
2. `design-system/tokens.css`
3. the nearest existing production component with the same purpose.

## Core rules

- Keep the product light, clean, professional, GIS-oriented, and restrained.
- Map overlays may use translucent glass; do not turn the whole product into glass UI.
- Do not invent a new visual language for one page.
- Reuse existing components/patterns before creating new ones.
- New reusable colors, radii, shadows, spacing, and typography should come from `tokens.css`.
- Do not add arbitrary raw hex values when an existing semantic token fits.
- Do not add arbitrary radii such as 7px / 9px / 13px / 15px.
- Default map points must be restrained. Glow is mainly for hover, selected, warning, or focus states.
- Do not add generic dark-blue "command center" styling, cyberpunk neon, or excessive gradients unless explicitly required.
- Approved screenshots/prototypes have priority for their specific task. Preserve their information hierarchy and relative sizing.

## Responsive rules

This repository already uses:

- 1920×1080 as the design baseline;
- `postcss-pxtorem`;
- `rootValue: 16`;
- `src/utils/rem.js`.

Therefore:

- write design dimensions in `px`;
- do not manually calculate/write rem values;
- do not introduce a second global scaling system such as full-page `vw` scaling or `transform: scale(...)`;
- use existing ECharts scaling helpers for charts.

## GIS review rules

Current hazard-review source types:

- 隐患点
- 基层自治风险点
- 大排查风险点

Current relation semantics:

- 关联关系
- 疑似关联

Do not silently add more source categories or decorative relation lines.

## Before finishing a UI task

Check:

- 1920×1080 baseline;
- one smaller desktop viewport;
- one larger/2K viewport;
- text overflow/readability;
- map overlay readability over imagery;
- no unnecessary glow;
- no new visual vocabulary without a product reason.

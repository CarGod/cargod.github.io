# FanFan Cards motion showcase

## Direction

Replace the static screenshot stack with two lightweight, native CSS demonstrations. The first shows FanFan mode turning on, saved words being highlighted, and a stored word card opening. The second shows a YouTube-style player where the FanFan subtitle control is activated and bilingual subtitles appear.

## Principles

- No visible release number: the page should describe a durable product, not a temporary build.
- Native HTML and CSS rather than GIF: sharper text, smaller payload, responsive layouts, and better dark-mode consistency.
- Each loop tells one short story and pauses on hover so visitors can inspect it.
- `prefers-reduced-motion` leaves both demos in their useful final state instead of forcing movement.
- The visual scenes are decorative; adjacent headings and copy provide the accessible explanation.

## Verification

- Validate HTML and local links.
- Capture desktop and mobile screenshots.
- Check the reduced-motion rendering.
- Confirm the deployed CSS cache key and GitHub Pages build.

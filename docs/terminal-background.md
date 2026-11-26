# Terminal background

The original city photograph is preserved in `public/assets/hero/`. The terminal
version was made with the built-in image-generation tool, using
`city-wide-color-1600.jpg` as the edit target. It retains the original scene and
uses a limited dark teal pixel-art palette matching the supplied reference.

Original pixel-art assets (retained):

- `public/assets/hero/city-terminal.webp` — landscape, 1672 × 941, about 63 KB.
- `public/assets/hero/city-terminal-tall.webp` — mobile crop, 828 × 1472, about 29 KB.

WebP compression and the mobile crop use Sharp. The original photographs and
previous color exports were not overwritten.

## Detailed TTY revision

The current background was regenerated with the built-in image tool, using the
3840-pixel source photograph and the first artwork as a palette reference. The
new version adds finer architectural and character detail, and is exported with
**lossless WebP** compression. Scanlines were removed to keep the artwork clear.

Current assets:

- `public/assets/hero/city-terminal-detail.webp` — 1672 × 941 native artwork.
- `public/assets/hero/city-terminal-detail-tall.webp` — 828 × 1472 mobile crop.

The generation prompt requests a 4K image; the tool returned 1672 × 941. The
website preserves those native pixels rather than claiming an upscale adds
detail. Pixel rendering keeps the deliberate edges crisp when enlarged. A dark
veil increases as visitors scroll to keep the rest of the portfolio legible.

Detailed-revision prompt:

```text
Use case: style-transfer.
Asset type: premium website background artwork. Deliver a true high-resolution 3840 x 2160 landscape image with clean, crisp edges.
Input image 1 is the original high-resolution photograph: preserve its exact city composition, viewpoint, man seen from behind with glasses and striped shirt, recognizable San Francisco buildings, and broad open sky. Input image 2 is a color and pixel-art reference from the previous design. Improve the artwork substantially while preserving its dark teal character.
Render a stunning, intricately crafted pixel-art interpretation of image 1, in the deep Solarized midnight palette of image 2: #002b36 and #032630 shadows, #163d48 and #254957 midtones, restrained #50737b and #79b7b2 edges. The sky remains dark blue-green, spacious and quiet for text. Keep the original silhouette at lower center and the buildings in their original positions. Detailed ordered pixels and clean intentional clusters, subtle dithered tonal transitions, precise windows, rooftop antennas, architectural edges, and tiny subdued window reflections. Underlying pixel detail should be much finer than image2, around 960 pixels across before crisp enlargement. Create depth through multiple architectural planes and carefully controlled teal light, rather than blurring. Faithful appearance of the source person, not an added character.
The final image must feel lovingly hand-crafted, rich and sharp on a high-DPI large desktop display, with no JPEG artifacts, smearing, soft focus, artificial film grain, scanlines, watermarks, text, terminal UI, extra objects or buildings. Keep luminance restrained enough for mint terminal text to remain legible. No purple, warm orange, white sky, neon cyberpunk additions or excessive brightness. This is the original personal photograph transformed into refined dark teal pixel art, not a different imagined city.
```

## Final image prompt

```text
Use case: style-transfer.
Asset type: full-bleed website background, landscape 16:9.
Edit target: the attached local photograph of Dhiraj seen from behind looking at the San Francisco skyline. Preserve its composition, viewpoint, silhouette, striped shirt, city buildings, and broad quiet sky.
Primary request: convert the ENTIRE photograph into authentic low-resolution, deliberately blocky pixel art with a tightly limited dark Solarized teal palette. Match the user's reference mood: near-black blue-green shadows #032630 and #002b36, muted blue-teal midtones #163d48 and #254957, subtle restrained highlights #50737b. No bright white, no yellow or orange, no neon, no purple. Even the sky should be deep dark teal. Recognizable buildings rendered as large tidy pixel clusters and subtle dithering. Character remains visible as a pixel silhouette at bottom center. Preserve broad negative space in upper left for website typography. The result should look like a calm midnight terminal wallpaper, not a photograph with a color filter. Crisply stepped pixel edges, about 480 pixels of underlying detail across the width enlarged to the output. No text, no UI, no logos, no added objects.
```

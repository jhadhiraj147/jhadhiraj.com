# Console font

The terminal uses **WebPlus IBM VGA 8x16**, an unmodified, locally hosted webfont
by **VileR** from [The Ultimate Oldschool PC Font Pack v2.2](https://int10h.org/oldschool-pc-fonts/).
The WOFF file is 22,584 bytes and is served from:

`public/fonts/WebPlus_IBM_VGA_8x16.woff`

This recreates the classic VGA 8×16 console glyphs with expanded Unicode
coverage for the portfolio's punctuation. It replaces the smooth IBM Plex Mono
font used in the earlier design.

Arch does not impose one font on every graphical terminal. Its
[Linux console documentation](https://wiki.archlinux.org/title/Linux_console#Fonts)
describes two fonts enabled in its supported kernels: VGA 8×16 and Terminus
16×32, with selection depending on the display resolution. This design chooses
the classic **VGA 8×16 TTY face**. The kernel's matching source is
[`lib/fonts/font_8x16.c`](https://github.com/torvalds/linux/blob/master/lib/fonts/font_8x16.c).
The website distributes VileR's web recreation, not the kernel source font data.

## Rendering

The font has a 1600-unit em and an 800-unit monospaced advance. At CSS
`font-size: 16px`, each character is 8px wide with a 16px natural height.
Use 16px (or integer multiples such as 32px) for the cleanest pixel grid.
A larger line height, such as 24px, is fine for readable spacing between rows.
Set `font-synthesis: none` to avoid synthetic bold or italic distortion; use
color for terminal emphasis. Browser and display scaling can still affect
rasterization.

Validation found 781 mapped Unicode codepoints and checked ASCII, shell
punctuation, en/em dashes, curly quotation marks, a middle dot, an ellipsis,
and terminal block/box-drawing symbols.

## Attribution and license

**Font adaptation by VileR**, [The Oldschool PC Font Resource](https://int10h.org/oldschool-pc-fonts/).
Licensed under [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).
The license applies to the font, rather than changing the repository's source-code license.
The original WOFF is redistributed without modification.

The full license and public attribution are included beside the font:

- `public/fonts/oldschool-pc-fonts-LICENSE.txt`
- `public/fonts/README.txt`

Downloaded from the [official webfont pack](https://int10h.org/oldschool-pc-fonts/download/oldschool_pc_font_pack_v2.2_web.zip).
SHA-256 of `WebPlus_IBM_VGA_8x16.woff`:

`4823e093c7f2f69641eaafb6f3465185afa63877cda58d341b6b317fd53dfd1f`

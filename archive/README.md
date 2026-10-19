# Archive

Retired files kept for reference. **Nothing in this directory is loaded by the live site.**

| Path | What it is | How to restore |
| --- | --- | --- |
| `music-player/` | The floating audio player: `music-player.js`, the three tracks and lyric files under `musics/`, its CSS, and the original `index.with-player.html`. | Move the JS back to `assets/js/`, `musics/` back to `assets/musics/`, re-add the player markup from `index.with-player.html`, append `music-player.css` to `assets/css/style.css`, and load `music-player.js` again. |
| `js/` | The old jQuery 3.4.1 + template scripts (`main.js`, `util.js`, `breakpoints.min.js`, `browser.min.js`, `canvas.js`). Replaced by the small vanilla `assets/js/site.js`. | Restore the scripts and their `<script>` tags from `index.with-player.html`. |
| `vendor/fontawesome5/` | Local Font Awesome 5 CSS and webfonts. The site now uses the Font Awesome 6 CDN only. | Re-add `@import url(fontawesome-all.min.css);` to `main.css` and restore the folder to `assets/`. |
| `fonts/` | Original un-subset TTF display fonts (HFStickyNotes, LoveIsFree, SJ-Narrow-Light, HFRoundRound, Sounso Quality). The live site uses small WOFF2 subsets instead. | Keep as reference; re-add the TTF and update `@font-face` in `style.css` if you need more glyphs. |
| `old-stuff/` | Legacy Discord bot source (`index.js`) and the old Violet Guild page (`violet.html`). Neither is linked from the site. | Copy back into `assets/old-stuff/` if needed. |
| `legacy/htaccess.txt` | The old Apache `.htaccess`. GitHub Pages ignores it; extensionless URLs already work natively. | Rename/move back to `.htaccess` only if hosting on Apache. |

Robots rules disallow `/archive/`, and no page links to it.

# QA Checklist - Task 05

This is my QA log for Task 05. I went through the website and checked functionality, accessibility, performance, and responsiveness. Below are the issues I found (High and Medium severity only), plus the two Part 1 checks I already finished.

**Status meanings:** Fixed = done and tested | Pending = still need to do it | Not Applicable = doesn't apply to this project

---

## Part 1 - Making Sure Everything Still Works

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-01 | Documentation | Whole project | I didn't have a QA log yet, so I couldn't track issues properly | Low | Fixed | Made this qa-checklist.md file |
| QA-02 | Console | Chrome DevTools | Checked the console for errors | Low | Fixed | Console is clean. The only thing that showed up was Chrome saying it opened my email app when I clicked the "hello@asfourabandora.com" link in the footer - that's normal, not a bug |

I also double checked for dead links,   duplicate IDs, and duplicate CSS rules and didn't find any, so nothing to log there.

---

## Part 2 - Accessibility

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-03 | Skip link | Whole site | If you only use a keyboard (no mouse), there's no way to skip past the header/nav to jump straight to the main content. You'd have to press Tab like 7 times just to get past the menu | High | Pending | Still need to add a hidden "Skip to main content" link that shows up when you press Tab |
| QA-04 | Focus outline on buttons | Whole site | In my CSS I wrote `outline: var(--color-accent)` for buttons, but I forgot to add a width and a style (like `solid`), so the outline doesn't actually show up when you tab to a button | High | Pending | Need to rewrite it as a full outline rule with a width and solid style |
| QA-05 | Text color contrast | Whole site | My service card and statistic titles use my pink accent color as text, and it's probably too light to read easily against the white/blue backgrounds | High | Pending | Need to pick a darker color for these headings and test the contrast ratio |
| QA-06 | Keyboard navigation | Whole site | Haven't fully tested tabbing through the entire page yet (Tab, Shift+Tab, Enter, Space, Escape) | Medium | Pending | Need to go through the whole page using only the keyboard and note anything that breaks |
| QA-07 | 200% zoom | Desktop | Haven't tested what the page looks like zoomed in to 200% yet | Medium | Pending | Need to zoom to 200% and check nothing overlaps or scrolls sideways |
| QA-08 | Lighthouse accessibility score | Chrome | Haven't run the Lighthouse accessibility audit yet | Medium | Pending | Need to run it and aim for a score of 90 or higher |

---

## Part 3 - Performance

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-9 | Logo file size | Whole site | My logo image is 500x500 pixels and about 55KB, but it only ever shows up on screen at around 40-65 pixels. That's way bigger than it needs to be | Medium | Pending | Need to resize/compress it, maybe convert to WebP |
| QA-10| Lighthouse performance score | Chrome, incognito | Haven't run the Lighthouse performance audit yet | Medium | Pending | Need to run it in an incognito window and fix what it suggests |

---

## Part 4 - Testing on Different Screens and Browsers

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-11 | Responsive widths | 320px, 375px, 1440px | Haven't manually gone through every required screen width yet | Medium | Pending | Need to test each width and check for overlapping or cut-off content |
| QA-12 | Second browser | Chrome + Firefox or Edge | Only really tested in one browser so far (which is chrome) | Medium | Pending | Need to open the site in a second browser and note any differences |


---

## Quick Summary

- Things I've already fixed: 2
- Things I still need to fix: 12
- High priority: 3 (skip link, button focus outline, text contrast)
- Medium priority: 9

My plan is to  finish up ones first (QA-03, QA-04, QA-06) since those affect accessibility the most then work through the Medium ones.

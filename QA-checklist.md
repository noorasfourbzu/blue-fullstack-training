# QA Checklist - Task 05

This is my QA log for Task 05. I went through the website and checked functionality, accessibility, performance, and responsiveness. Below are the issues I found.

**Status meanings:** Fixed = done and tested | Pending = still need to do it | Not Applicable = doesn't apply to this project

---

## Part 1 - Making Sure Everything Still Works

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-01 | Documentation | Whole project | I didn't have a QA log yet, so I couldn't track issues properly | Low | Fixed | Made this qa-checklist.md file |
| QA-02 | Console | Chrome DevTools | Checked the console for errors | Low | Fixed | Console is clean. The only thing that showed up was Chrome saying it opened my email app when I clicked the "hello@asfourabandora.com" link in the footer - that's normal, not a bug |


I also double checked for dead links, duplicate IDs, and duplicate CSS rules and didn't find any, so nothing to log there.

---

## Part 2 - Accessibility

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-03 | Skip link | Whole site | If you only use a keyboard (no mouse), there's no way to skip past the header/nav to jump straight to the main content. You'd have to press Tab like 7 times just to get past the menu | High | Fixed | Added Skip to main content, fixed the link to point to `#main` so it actually jumps to the main content, and confirmed it visits the nav bar, hero, contact section, footer links... and any other interactive part |
| QA-04 | Focus outline on buttons | Whole site | In my CSS I wrote `outline: var(--color-accent)` for buttons, but I forgot to add a width and a style (like `solid`), so the outline doesn't actually show up when you tab to a button | High | Fixed | Rewrote it as a full outline rule with a width and solid style, applied to buttons, inputs, textareas, and selects together |
| QA-05 | Text color contrast | Whole site | My service card and statistic titles use my pink accent color as text, and it's probably too light to read easily against the white/blue backgrounds | High | Fixed | Changed the accent color to a darker pink , changed the textcolor for buttons into more suitable color and re checked the contrast against the backgrounds it's used on , this was done using https://dequeuniversity.com/color-contrast to check contrast |
| QA-06 | Keyboard navigation | Whole site | Tested tabbing through the entire page using only the keyboard (Tab, Shift+Tab, Enter, Space, Escape) | Medium | Fixed | Went through the whole page - no issues found, everything reachable and works as expected |
| QA-07 | 200% zoom | Desktop | Tested what the page looks like zoomed in to 200% | Medium | Fixed | Checked all sections at 200% zoom - nothing overlaps or scrolls sideways, no issues found |
| QA-08 | Lighthouse accessibility score | Chrome | Ran the Lighthouse accessibility audit | Medium | Fixed | Score: 100/100 (target was 90+). 22 automated checks passed, 0 failed. Also manually reviewed the 10 checks Lighthouse can't score automatically (keyboard focus order, focus traps, ARIA roles, landmarks, etc.) by tabbing through the whole site with Tab/Shift+Tab/Enter/Space/Escape ,no issues found. Full report saved separately as Performance & Accessibility Test Report also a screenshot is available |

---

## Part 3 - Performance

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-9 | Logo file size | Whole site | My logo image is 500x500 pixels and about 55KB, but it only ever shows up on screen at around 40-65 pixels. That's way bigger than it needs to be | Medium | Fixed | Resized to 200x200 and converted to WebP - now about 2.4KB, a big drop from the original 55KB |
| QA-10 | Lighthouse performance score | Chrome, incognito | Ran the Lighthouse performance audit in an incognito window | Medium | Fixed | Score: 100/100. FCP 0.2s, LCP 0.3s, TBT 0ms, CLS 0, Speed Index 0.2s - all in the excellent range. Total page payload ~49.5 KiB. Lighthouse suggested minor optimizations (cache lifetimes, render-blocking CSS, minification) but none are needed for a project this size so these are none affect the score. Full report saved separately as Performance & Accessibility Test Report and a screenshot is available |

---

## Part 4 - Testing on Different Screens and Browsers

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-11 | Responsive widths | 320px, 375px, 768px, 1024px, 1440px | Went through every required screen width using responsive dev tools | Medium | Fixed | Checked all five widths - no overlapping content, no cut-off text, no horizontal scrolling, mobile menu and contact form both hold up correctly at every width |
| QA-12 | Second browser | Chrome + Firefox | Tested the site in a second browser | Medium | Fixed | Opened the site in a second browser alongside Chrome. layout, navigation, form validation, and animations all match, no browser specific issues found |
| QA-13 | Duplicate CSS rule | style.css | Found a second, leftover `button:focus-visible` rule further down the file, separate from the fixed one used for QA-04. It was missing the word "solid" so it wasnt doing anything, but it was still unused duplicate code sitting in the file | Low | Fixed | Removed the extra rule . Now only one `button:focus-visible` rule remains in the file |

---

## Quick Summary

- Things I've already fixed: 13
- Things I still need to fix: 0
- High priority: 0 remaining
- Medium/Low priority: 0 remaining


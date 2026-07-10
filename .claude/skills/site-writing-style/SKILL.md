---
name: site-writing-style
description: Use whenever writing or editing prose for this site (blog posts in _posts, news in _news, project pages in _projects). Covers punctuation style and the project-hub page structure.
---

# Punctuation style

No em dashes or en dashes ("—", "–") anywhere in prose. No colons used as connective tissue mid-sentence (e.g. "X is true: here is why").

Colons ARE fine, and should be kept, when they introduce something that follows:

- A sentence right before a bullet or numbered list ("As vehicles move through urban environments, they encounter:")
- A bold inline label before its value ("**Duration:** August 25 to August 29, 2025")
- A bold mini-header before a block of content ("**Key Achievements:**")

When removing a dash, don't just drop in a comma blindly, check whether both sides of the comma could stand alone as a full sentence (subject + verb). If they can, it's a comma splice and needs a period or a restructure instead. Commas are fine when one side is an appositive, a participial phrase, or otherwise not a full independent clause.

If a comma-joined list itself contains commas (e.g. "its three variants, X, Y, and Z, with a note about..."), don't nest it in more commas, it gets hard to parse. Use parentheses instead.

Tone overall: concise, clear, academic but not stiff, allowed a little dry humor. Code identifiers, filenames, and commands always in backtick/code-font, never plain text.

# Project page structure

Each `_projects/*.md` page is a hub, not a single essay. Front matter carries a `branches` list, each entry is `{title, description, date, url, external (optional)}`. The `_layouts/page.liquid` layout auto-renders these as a card grid via `_includes/branches.liquid` whenever `page.branches` is present, no need to add anything to the page body for that part.

The page body itself should read as:

1. A short overview of what the project is and why it exists
2. A purpose section, what it's actually for, ideally a bullet list of concrete goals
3. Optionally a closing "where this is going" section for future direction

Branches can point to actual blog posts in `_posts/`, or to other project pages, internal or external links both work (set `external: true` for links that should open in a new tab and not go through `relative_url`).

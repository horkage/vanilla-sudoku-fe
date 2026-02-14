# Puzzle Preview Images

This directory contains preview images for all puzzles, organized by difficulty level.

## Structure

```
puzzles/
  easy/
    0001.png
    0002.png
    ...
  medium/
    0001.png
    ...
  hard/
    0001.png
    ...
```

## Usage

These images are:
- Used in Open Graph meta tags for social media sharing
- Referenced in Bluesky posts as preview images
- Generated via automated screenshot tool from puzzle pages

## Naming Convention

Images are named with zero-padded puzzle IDs matching the puzzle-data structure:
- `{difficulty}/{id}.png` where id is 4-digit zero-padded (e.g., `0001`, `0042`, `0123`)

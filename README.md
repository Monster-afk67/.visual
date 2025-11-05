# Visually Script: A Library for the .visual Format

Visually Script is a lightweight, zero-dependency library for creating, reading, and manipulating `.visual` presentation files used by the Visually presentation tool.

It provides a simple, fluent API for programmatically generating complex presentations from various media sources like images, videos, websites, and custom-built slides.

## Features

- **Type-Safe:** Fully written in TypeScript to ensure your presentation structure is always valid.
- **Fluent API:** Chain methods to intuitively build slides and presentations.
- **JSON-Based:** The `.visual` format is simply a structured JSON file, making it easy to parse and use anywhere.
- **Zero Dependencies:** Can be used in any JavaScript or TypeScript project without any external dependencies.

## Installation

```bash
# You can copy the files from this library directly into your project.
# If published to npm, you would do:
# npm install visually-script
```

## Quick Start

### Creating a Presentation (`Writer`)

Here's how to create a new `.visual` presentation from scratch.

```typescript
import { Presentation, Slide, Source } from './builder';

// 1. Create a new presentation
const myPresentation = new Presentation('My First Programmatic Presentation');

// 2. Add different types of media
myPresentation
  .addSlide(
    new Slide('Introduction')
      .addText({ content: 'Hello, World!', fontSize: 80, y: 200 })
  )
  .addImage('https://placehold.co/1280x720.png', 'Placeholder Image')
  .addYouTube('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'An Important Video')
  .addWebsite('https://google.com', 'Google Search');

// 3. Add sources for the bibliography
myPresentation.addSource(
  new Source('Visually Project', 'https://github.com/your-repo')
);

// 4. Get the final JSON object
const presentationJson = myPresentation.toJSON();

// `presentationJson` is now a serializable JavaScript object.
// You can save it as a .visual file:
const fileContent = JSON.stringify(presentationJson, null, 2);
// fs.writeFileSync('my-presentation.visual', fileContent);

console.log(fileContent);
```

### Reading a Presentation (`Reader`)

Use the `parseVisualFile` function to safely read and validate a `.visual` or `.json` file.

```typescript
import { parseVisualFile } from './parser';

const fileContent = '...'; // Your file content as a string

try {
  const presentationData = parseVisualFile(fileContent);
  console.log('Successfully parsed presentation:', presentationData.title);
  console.log('Number of media items:', presentationData.mediaQueue.length);
} catch (error) {
  console.error('Failed to parse .visual file:', error.message);
}
```

## The .visual Format

The `.visual` format is a JSON file with two main keys:
- `mediaQueue`: An array of `MediaItem` objects representing the slides and media in the presentation.
- `sources`: An array of `SourceItem` objects for the bibliography.

The structure is fully defined in `types.ts`.

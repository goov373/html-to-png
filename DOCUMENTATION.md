# html-to-png Documentation

Complete guide for using the html-to-png library to export HTML elements as images.

---

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [Options Reference](#options-reference)
7. [Common Use Cases](#common-use-cases)
8. [Troubleshooting](#troubleshooting)
9. [Browser Support](#browser-support)

---

## Overview

**html-to-png** is a lightweight library that converts any HTML element into a PNG or JPEG image. It works entirely in the browser—no server required.

### What It Does

- Takes any DOM element (div, section, canvas, etc.)
- Renders it to an image (PNG or JPEG)
- Returns the image as a data URL, Blob, or Canvas
- Optionally triggers a download

### When to Use It

- Export user-created designs or content
- Generate social media images from HTML templates
- Create downloadable certificates, cards, or graphics
- Screenshot specific parts of your application
- Generate thumbnails from HTML content

---

## How It Works

### The Rendering Pipeline

```
HTML Element → Clone → Inline Styles → Embed Resources → SVG → Canvas → Image
```

1. **Clone the Element**: The library creates a deep clone of your HTML element
2. **Inline Styles**: All computed styles are converted to inline styles
3. **Embed Resources**: Images and fonts are converted to base64 data URLs
4. **Create SVG**: The styled HTML is wrapped in an SVG foreignObject
5. **Draw to Canvas**: The SVG is rendered onto an HTML Canvas
6. **Export Image**: The canvas is exported as PNG/JPEG

### Why This Approach?

Browsers don't allow direct HTML-to-image conversion for security reasons. The SVG foreignObject technique is the most reliable cross-browser method that:
- Preserves CSS styling
- Handles complex layouts (flexbox, grid)
- Supports web fonts
- Works with images

### Pixel Ratio Explained

Modern displays have high pixel densities (Retina, 4K). The `pixelRatio` option controls image sharpness:

| pixelRatio | Result | Best For |
|------------|--------|----------|
| 1 | 1:1 pixels | Small file size, web thumbnails |
| 2 | 2x resolution | Standard high-quality exports |
| 3 | 3x resolution | Print, large displays |

Example: A 400x300 element with `pixelRatio: 2` produces an 800x600 image.

---

## Installation

### Option 1: npm Install

```bash
npm install html-to-png
```

Then import in your code:

```typescript
import { exportToPng, downloadImage } from 'html-to-png';
```

### Option 2: Copy the dist folder

Copy the `dist/` folder into your project and import directly:

```typescript
import { exportToPng, downloadImage } from './path/to/dist/index.js';
```

### Option 3: Script tag (UMD)

If you need a script tag version, you'll need to bundle the library first using a tool like Rollup or webpack.

---

## Quick Start

### Basic PNG Export

```html
<div id="my-content">
  <h1>Hello World</h1>
  <p>This will become an image!</p>
</div>

<button id="export-btn">Export as PNG</button>
```

```typescript
import { exportToPng, downloadImage } from 'html-to-png';

document.getElementById('export-btn').addEventListener('click', async () => {
  const element = document.getElementById('my-content');

  // Export to PNG
  const dataUrl = await exportToPng(element, { pixelRatio: 2 });

  // Download the image
  downloadImage(dataUrl, 'my-export.png');
});
```

### Basic JPEG Export

```typescript
import { exportToJpeg, downloadImage } from 'html-to-png';

const element = document.getElementById('my-content');

const dataUrl = await exportToJpeg(element, {
  pixelRatio: 2,
  quality: 0.9,
  backgroundColor: '#ffffff'  // Required for JPEG
});

downloadImage(dataUrl, 'my-export.jpg');
```

---

## API Reference

### exportToPng(element, options?)

Exports an HTML element as a PNG image.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | HTMLElement | Yes | The DOM element to export |
| options | ExportOptions | No | Configuration options |

**Returns:** `Promise<string>` - A data URL containing the PNG image (base64 encoded)

**Example:**
```typescript
const dataUrl = await exportToPng(element, { pixelRatio: 2 });
// Returns: "data:image/png;base64,iVBORw0KGgo..."
```

---

### exportToJpeg(element, options?)

Exports an HTML element as a JPEG image.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | HTMLElement | Yes | The DOM element to export |
| options | ExportOptions | No | Configuration options |

**Returns:** `Promise<string>` - A data URL containing the JPEG image (base64 encoded)

**Important:** JPEG doesn't support transparency. Always set a `backgroundColor` to avoid black backgrounds where transparency exists.

**Example:**
```typescript
const dataUrl = await exportToJpeg(element, {
  quality: 0.85,
  backgroundColor: '#ffffff'
});
// Returns: "data:image/jpeg;base64,/9j/4AAQSkZ..."
```

---

### exportToBlob(element, options?)

Exports an HTML element as a Blob object.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | HTMLElement | Yes | The DOM element to export |
| options | ExportOptions | No | Configuration options |

**Returns:** `Promise<Blob | null>` - A Blob containing the PNG image, or null on failure

**When to Use:**
- Uploading images to a server
- Using with FormData
- Creating object URLs
- Working with the File API

**Example:**
```typescript
const blob = await exportToBlob(element, { pixelRatio: 2 });

if (blob) {
  // Upload to server
  const formData = new FormData();
  formData.append('image', blob, 'export.png');

  await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
}
```

---

### exportToCanvas(element, options?)

Exports an HTML element as an HTML Canvas element.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | HTMLElement | Yes | The DOM element to export |
| options | ExportOptions | No | Configuration options |

**Returns:** `Promise<HTMLCanvasElement>` - A canvas element containing the rendered image

**When to Use:**
- Adding watermarks or overlays
- Further image manipulation
- Combining multiple exports
- Custom image processing

**Example:**
```typescript
const canvas = await exportToCanvas(element, { pixelRatio: 2 });

// Add a watermark
const ctx = canvas.getContext('2d');
ctx.font = '20px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
ctx.fillText('© 2024 My Company', 10, canvas.height - 10);

// Export the modified canvas
const dataUrl = canvas.toDataURL('image/png');
```

---

### downloadImage(dataUrl, filename)

Triggers a browser download for a data URL.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dataUrl | string | Yes | The data URL from exportToPng or exportToJpeg |
| filename | string | Yes | The filename including extension |

**Example:**
```typescript
const dataUrl = await exportToPng(element);
downloadImage(dataUrl, 'my-design.png');
```

---

### downloadBlob(blob, filename)

Triggers a browser download for a Blob.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| blob | Blob | Yes | The Blob from exportToBlob |
| filename | string | Yes | The filename including extension |

**Example:**
```typescript
const blob = await exportToBlob(element);
if (blob) {
  downloadBlob(blob, 'my-design.png');
}
```

---

### captureViewport(container, options?)

Captures exactly what's visible in a container element—perfect for image editor apps where you want to export exactly what the user sees on screen.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| container | HTMLElement | Yes | Container with overflow (hidden/scroll/auto) |
| options | ViewportOptions | No | Capture options (extends ExportOptions) |

**Returns:** `Promise<string>` - A data URL (PNG or JPEG)

**How It Works:**
1. Measures the container's visible area (`clientWidth` × `clientHeight`)
2. Temporarily hides scrollbars (restores them after)
3. Captures only the visible portion
4. Optionally crops to a specific region

**ViewportOptions (in addition to ExportOptions):**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| format | `'png'` \| `'jpeg'` | `'png'` | Output format |
| hideScrollbars | boolean | `true` | Hide scrollbars in export |
| region | object | - | Crop to specific area |

**Example - Basic Usage:**
```typescript
import { captureViewport, downloadImage } from 'html-to-png';

// Your design canvas container
const canvas = document.getElementById('design-canvas');

// Capture exactly what's visible
const dataUrl = await captureViewport(canvas, {
  pixelRatio: 2,
  format: 'png'
});

downloadImage(dataUrl, 'my-design.png');
```

**Example - Capture Specific Region:**
```typescript
// Only capture a 400x300 area starting at (100, 50)
const dataUrl = await captureViewport(canvas, {
  pixelRatio: 2,
  region: {
    x: 100,
    y: 50,
    width: 400,
    height: 300
  }
});
```

**Example - JPEG with Background:**
```typescript
const dataUrl = await captureViewport(canvas, {
  format: 'jpeg',
  quality: 0.9,
  backgroundColor: '#ffffff'
});
```

**When to Use captureViewport vs exportToPng:**

| Scenario | Use |
|----------|-----|
| Export full element (even hidden overflow) | `exportToPng` |
| Export only visible portion | `captureViewport` |
| Image editor with zoom/pan | `captureViewport` |
| Static card or component | `exportToPng` |
| Scrollable design canvas | `captureViewport` |

---

### getViewportInfo(container)

Returns information about a container's viewport. Useful for UI or debugging before calling `captureViewport`.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| container | HTMLElement | Yes | The container element |

**Returns:**
```typescript
{
  visibleWidth: number;    // Visible width (clientWidth)
  visibleHeight: number;   // Visible height (clientHeight)
  scrollLeft: number;      // Current horizontal scroll
  scrollTop: number;       // Current vertical scroll
  scrollWidth: number;     // Total content width
  scrollHeight: number;    // Total content height
  isScrollable: boolean;   // Has any scrollable content
  hasHorizontalScroll: boolean;
  hasVerticalScroll: boolean;
}
```

**Example:**
```typescript
import { getViewportInfo } from 'html-to-png';

const canvas = document.getElementById('design-canvas');
const info = getViewportInfo(canvas);

console.log(`Visible area: ${info.visibleWidth} × ${info.visibleHeight}`);
console.log(`Total content: ${info.scrollWidth} × ${info.scrollHeight}`);
console.log(`Scroll position: (${info.scrollLeft}, ${info.scrollTop})`);

if (info.isScrollable) {
  console.log('Content extends beyond visible area');
}
```

---

## Options Reference

All export functions accept an optional `ExportOptions` object:

```typescript
interface ExportOptions {
  pixelRatio?: number;
  quality?: number;
  backgroundColor?: string;
  filter?: (node: HTMLElement) => boolean;
  width?: number;
  height?: number;
  skipFonts?: boolean;
}
```

### pixelRatio

**Type:** `number`
**Default:** `2`

Controls the resolution multiplier for the output image.

```typescript
// Standard resolution (1:1)
await exportToPng(element, { pixelRatio: 1 });

// High resolution (2x) - recommended for most uses
await exportToPng(element, { pixelRatio: 2 });

// Ultra high resolution (3x) - for print or large displays
await exportToPng(element, { pixelRatio: 3 });
```

### quality

**Type:** `number` (0 to 1)
**Default:** `0.95`

JPEG compression quality. Only applies to `exportToJpeg`.

```typescript
// Maximum quality (larger file)
await exportToJpeg(element, { quality: 1.0 });

// High quality (recommended)
await exportToJpeg(element, { quality: 0.9 });

// Medium quality (smaller file)
await exportToJpeg(element, { quality: 0.7 });
```

### backgroundColor

**Type:** `string`
**Default:** `undefined` for PNG, `'#ffffff'` for JPEG

Sets the background color for the exported image.

```typescript
// White background
await exportToJpeg(element, { backgroundColor: '#ffffff' });

// Transparent (PNG only)
await exportToPng(element, { backgroundColor: undefined });

// Custom color
await exportToPng(element, { backgroundColor: '#f0f0f0' });
```

### filter

**Type:** `(node: HTMLElement) => boolean`
**Default:** `undefined`

A function to exclude certain elements from the export. Return `false` to exclude an element.

```typescript
await exportToPng(element, {
  filter: (node) => {
    // Exclude elements with 'no-export' class
    if (node.classList?.contains('no-export')) {
      return false;
    }
    // Exclude all buttons
    if (node.tagName === 'BUTTON') {
      return false;
    }
    return true;
  }
});
```

### width / height

**Type:** `number`
**Default:** Element's natural dimensions

Override the output dimensions.

```typescript
// Force specific dimensions
await exportToPng(element, {
  width: 1200,
  height: 630  // LinkedIn/Facebook image size
});
```

### skipFonts

**Type:** `boolean`
**Default:** `false`

Skip embedding fonts for faster export. Use when fonts are already available or speed is critical.

```typescript
// Faster export without font embedding
await exportToPng(element, { skipFonts: true });
```

---

## Common Use Cases

### Image Editor / Design Canvas Export

The most common use case for `captureViewport`—export exactly what the user sees in a design tool:

```typescript
import { captureViewport, getViewportInfo, downloadImage } from 'html-to-png';

class DesignCanvasExporter {
  private canvas: HTMLElement;

  constructor(canvasSelector: string) {
    this.canvas = document.querySelector(canvasSelector) as HTMLElement;
  }

  // Export exactly what's visible
  async exportVisible(filename: string) {
    const dataUrl = await captureViewport(this.canvas, {
      pixelRatio: 2,
      format: 'png'
    });
    downloadImage(dataUrl, filename);
  }

  // Export at specific dimensions (e.g., for social media)
  async exportForSocialMedia(platform: 'instagram' | 'twitter' | 'linkedin') {
    const sizes = {
      instagram: { width: 1080, height: 1080 },
      twitter: { width: 1200, height: 675 },
      linkedin: { width: 1200, height: 627 }
    };

    const size = sizes[platform];
    const info = getViewportInfo(this.canvas);

    // Calculate centered region
    const region = {
      x: (info.visibleWidth - size.width) / 2,
      y: (info.visibleHeight - size.height) / 2,
      width: size.width,
      height: size.height
    };

    const dataUrl = await captureViewport(this.canvas, {
      pixelRatio: 2,
      region
    });

    downloadImage(dataUrl, `design-${platform}.png`);
  }

  // Get export preview info
  getExportInfo() {
    return getViewportInfo(this.canvas);
  }
}

// Usage
const exporter = new DesignCanvasExporter('#design-canvas');
await exporter.exportVisible('my-design.png');
```

---

### Social Media Image Generator

```typescript
async function generateSocialImage(element: HTMLElement, platform: string) {
  const sizes = {
    twitter: { width: 1200, height: 675 },
    facebook: { width: 1200, height: 630 },
    instagram: { width: 1080, height: 1080 },
    linkedin: { width: 1200, height: 627 }
  };

  const size = sizes[platform] || sizes.twitter;

  const dataUrl = await exportToPng(element, {
    pixelRatio: 2,
    width: size.width,
    height: size.height
  });

  downloadImage(dataUrl, `${platform}-post.png`);
}
```

### Export with Loading State

```typescript
async function exportWithFeedback(element: HTMLElement) {
  const button = document.getElementById('export-btn');

  try {
    button.disabled = true;
    button.textContent = 'Exporting...';

    const dataUrl = await exportToPng(element, { pixelRatio: 2 });
    downloadImage(dataUrl, 'export.png');

    button.textContent = 'Done!';
  } catch (error) {
    button.textContent = 'Export Failed';
    console.error('Export error:', error);
  } finally {
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Export as PNG';
    }, 2000);
  }
}
```

### Batch Export Multiple Elements

```typescript
async function exportMultiple(elements: HTMLElement[]) {
  const results = [];

  for (let i = 0; i < elements.length; i++) {
    const dataUrl = await exportToPng(elements[i], { pixelRatio: 2 });
    results.push({
      index: i,
      dataUrl
    });
  }

  return results;
}

// Usage
const cards = document.querySelectorAll('.card');
const exports = await exportMultiple([...cards]);
```

### Upload to Server

```typescript
async function exportAndUpload(element: HTMLElement) {
  const blob = await exportToBlob(element, { pixelRatio: 2 });

  if (!blob) {
    throw new Error('Export failed');
  }

  const formData = new FormData();
  formData.append('image', blob, 'export.png');
  formData.append('timestamp', Date.now().toString());

  const response = await fetch('/api/images/upload', {
    method: 'POST',
    body: formData
  });

  return response.json();
}
```

### Add Watermark

```typescript
async function exportWithWatermark(element: HTMLElement, watermarkText: string) {
  const canvas = await exportToCanvas(element, { pixelRatio: 2 });
  const ctx = canvas.getContext('2d');

  // Configure watermark style
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;

  // Position in bottom-right corner
  const x = canvas.width - 20;
  const y = canvas.height - 20;
  ctx.textAlign = 'right';

  // Draw watermark with outline
  ctx.strokeText(watermarkText, x, y);
  ctx.fillText(watermarkText, x, y);

  // Export final image
  return canvas.toDataURL('image/png');
}
```

---

## Troubleshooting

### Images Not Appearing

**Problem:** Exported image is missing some images or shows broken image placeholders.

**Cause:** Cross-origin images can't be embedded due to CORS restrictions.

**Solutions:**
1. Host images on the same domain
2. Configure CORS headers on your image server
3. Use base64-encoded images directly in your HTML
4. Proxy images through your own server

```typescript
// Use base64 images
<img src="data:image/png;base64,iVBORw0KGgo..." />

// Or ensure CORS headers
// Access-Control-Allow-Origin: *
```

### Fonts Not Rendering

**Problem:** Text appears in a fallback font instead of your custom font.

**Cause:** Web fonts may not be fully loaded or can't be embedded.

**Solutions:**
1. Ensure fonts are loaded before exporting:
```typescript
await document.fonts.ready;
const dataUrl = await exportToPng(element);
```

2. Use self-hosted fonts (not Google Fonts CDN)
3. Use `@font-face` with base64-encoded fonts

### Black Background on JPEG

**Problem:** Transparent areas appear black in JPEG exports.

**Cause:** JPEG doesn't support transparency.

**Solution:** Always set a background color:
```typescript
await exportToJpeg(element, {
  backgroundColor: '#ffffff'
});
```

### Blurry Images

**Problem:** Exported images look pixelated or blurry.

**Cause:** Low pixel ratio on high-DPI displays.

**Solution:** Increase the pixel ratio:
```typescript
await exportToPng(element, { pixelRatio: 2 }); // or 3
```

### Export Takes Too Long

**Problem:** Large elements take a long time to export.

**Solutions:**
1. Skip font embedding:
```typescript
await exportToPng(element, { skipFonts: true });
```

2. Reduce pixel ratio:
```typescript
await exportToPng(element, { pixelRatio: 1 });
```

3. Exclude unnecessary elements:
```typescript
await exportToPng(element, {
  filter: (node) => !node.classList?.contains('heavy-animation')
});
```

### Element Not Found Error

**Problem:** "Element is required" error.

**Cause:** The element doesn't exist or isn't in the DOM.

**Solution:** Ensure the element exists:
```typescript
const element = document.getElementById('my-element');

if (!element) {
  console.error('Element not found');
  return;
}

const dataUrl = await exportToPng(element);
```

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | 64+ |
| Firefox | 67+ |
| Safari | 11.1+ |
| Edge | 79+ |
| Opera | 51+ |
| iOS Safari | 11.3+ |
| Android Chrome | 64+ |

### Known Limitations

- **IE11:** Not supported (no foreignObject support)
- **Safari:** Some CSS filters may not render correctly
- **Mobile:** Very large exports may fail due to memory limits

---

## TypeScript Support

The library includes full TypeScript definitions. All types are exported:

```typescript
import type { ExportOptions, ExportResult } from 'html-to-png';

const options: ExportOptions = {
  pixelRatio: 2,
  quality: 0.9
};
```

---

## License

MIT License - free for personal and commercial use.

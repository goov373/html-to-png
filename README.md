# html-to-png

Minimal PNG/JPEG export library for HTML elements. Convert any DOM element to a high-quality image.

## Installation

```bash
npm install html-to-png
```

Or copy the `dist/` folder into your project.

## Usage

### Export as PNG

```typescript
import { exportToPng, downloadImage } from 'html-to-png';

const element = document.getElementById('my-element');

// Get PNG as data URL
const pngDataUrl = await exportToPng(element, {
  pixelRatio: 2  // 2x resolution for sharp images
});

// Download it
downloadImage(pngDataUrl, 'my-export.png');
```

### Export as JPEG

```typescript
import { exportToJpeg, downloadImage } from 'html-to-png';

const element = document.getElementById('my-element');

// Get JPEG as data URL
const jpegDataUrl = await exportToJpeg(element, {
  quality: 0.9,
  backgroundColor: '#ffffff'  // Required for JPEG (no transparency)
});

// Download it
downloadImage(jpegDataUrl, 'my-export.jpg');
```

### Export as Blob

Useful for uploading to servers or using with `FormData`:

```typescript
import { exportToBlob, downloadBlob } from 'html-to-png';

const element = document.getElementById('my-element');
const blob = await exportToBlob(element);

if (blob) {
  // Upload to server
  const formData = new FormData();
  formData.append('image', blob, 'export.png');
  await fetch('/upload', { method: 'POST', body: formData });

  // Or download
  downloadBlob(blob, 'my-export.png');
}
```

### Export as Canvas

For further manipulation before export:

```typescript
import { exportToCanvas } from 'html-to-png';

const element = document.getElementById('my-element');
const canvas = await exportToCanvas(element);

// Draw additional content
const ctx = canvas.getContext('2d');
ctx.fillText('Watermark', 10, 20);

// Get final image
const dataUrl = canvas.toDataURL('image/png');
```

### Capture Viewport (Exactly What User Sees)

Perfect for image editors, design tools, or any app where you want to export exactly what's visible on screen:

```typescript
import { captureViewport, downloadImage } from 'html-to-png';

// Get the design canvas container
const designCanvas = document.getElementById('design-canvas');

// Capture exactly what's visible (hides scrollbars automatically)
const dataUrl = await captureViewport(designCanvas, {
  pixelRatio: 2,
  format: 'png'
});

downloadImage(dataUrl, 'my-design.png');
```

Capture a specific region within the viewport:

```typescript
const dataUrl = await captureViewport(designCanvas, {
  region: { x: 100, y: 50, width: 400, height: 300 }
});
```

Check viewport info before capturing:

```typescript
import { getViewportInfo } from 'html-to-png';

const info = getViewportInfo(designCanvas);
console.log(`Visible: ${info.visibleWidth}x${info.visibleHeight}`);
console.log(`Scrollable: ${info.isScrollable}`);
```

## API Reference

### `exportToPng(element, options?)`

Export an HTML element as a PNG data URL.

**Parameters:**
- `element` - The HTML element to export
- `options` - Export options (see below)

**Returns:** `Promise<string>` - PNG data URL

### `exportToJpeg(element, options?)`

Export an HTML element as a JPEG data URL.

**Parameters:**
- `element` - The HTML element to export
- `options` - Export options (see below)

**Returns:** `Promise<string>` - JPEG data URL

### `exportToBlob(element, options?)`

Export an HTML element as a Blob.

**Returns:** `Promise<Blob | null>` - PNG Blob

### `exportToCanvas(element, options?)`

Export an HTML element as a Canvas.

**Returns:** `Promise<HTMLCanvasElement>` - Canvas element

### `downloadImage(dataUrl, filename)`

Download a data URL as a file.

**Parameters:**
- `dataUrl` - The data URL from `exportToPng` or `exportToJpeg`
- `filename` - The filename (include extension, e.g., `'export.png'`)

### `downloadBlob(blob, filename)`

Download a Blob as a file.

**Parameters:**
- `blob` - The Blob from `exportToBlob`
- `filename` - The filename (include extension)

### `captureViewport(container, options?)`

Capture exactly what's visible in a container element. Automatically hides scrollbars.

**Parameters:**
- `container` - The container element (div with overflow:hidden/scroll/auto)
- `options` - ViewportOptions (extends ExportOptions)

**Additional Options:**
- `format` - `'png'` or `'jpeg'` (default: `'png'`)
- `hideScrollbars` - Hide scrollbars in export (default: `true`)
- `region` - Capture specific region: `{ x, y, width, height }`

**Returns:** `Promise<string>` - Data URL

### `getViewportInfo(container)`

Get information about a container's viewport before capturing.

**Returns:** Object with `visibleWidth`, `visibleHeight`, `scrollLeft`, `scrollTop`, `scrollWidth`, `scrollHeight`, `isScrollable`, `hasHorizontalScroll`, `hasVerticalScroll`

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pixelRatio` | `number` | `2` | Pixel ratio for high-DPI (1, 2, or 3) |
| `quality` | `number` | `0.95` | JPEG quality (0-1) |
| `backgroundColor` | `string` | `'#ffffff'` (JPEG) | Background color |
| `filter` | `(node) => boolean` | - | Exclude nodes from export |
| `width` | `number` | - | Override width |
| `height` | `number` | - | Override height |
| `skipFonts` | `boolean` | `false` | Skip font embedding (faster) |

## Tips

### High-Quality Exports

For the sharpest images, use `pixelRatio: 2` or `pixelRatio: 3`:

```typescript
const dataUrl = await exportToPng(element, { pixelRatio: 3 });
```

### Excluding Elements

Use the `filter` option to exclude certain elements:

```typescript
const dataUrl = await exportToPng(element, {
  filter: (node) => {
    // Exclude elements with 'no-export' class
    return !node.classList?.contains('no-export');
  }
});
```

### JPEG Background Color

JPEG doesn't support transparency. Always set a background color:

```typescript
const dataUrl = await exportToJpeg(element, {
  backgroundColor: '#ffffff'  // White background
});
```

## Dependencies

- [html-to-image](https://www.npmjs.com/package/html-to-image) - Core rendering library

## License

MIT

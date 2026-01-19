import { toPng, toJpeg, toBlob, toCanvas } from 'html-to-image';
import type { ExportOptions, ViewportOptions } from './types';

// Default options
const DEFAULT_PIXEL_RATIO = 2;
const DEFAULT_JPEG_QUALITY = 0.95;
const DEFAULT_JPEG_BACKGROUND = '#ffffff';

/**
 * Convert ExportOptions to html-to-image options
 */
function toHtmlToImageOptions(options: ExportOptions = {}, isJpeg = false): Record<string, unknown> {
  return {
    pixelRatio: options.pixelRatio ?? DEFAULT_PIXEL_RATIO,
    quality: options.quality ?? DEFAULT_JPEG_QUALITY,
    backgroundColor: options.backgroundColor ?? (isJpeg ? DEFAULT_JPEG_BACKGROUND : undefined),
    filter: options.filter,
    width: options.width,
    height: options.height,
    skipFonts: options.skipFonts,
  };
}

/**
 * Export an HTML element as a PNG data URL
 *
 * @param element - The HTML element to export
 * @param options - Export options
 * @returns Promise resolving to a PNG data URL (base64)
 *
 * @example
 * ```ts
 * const dataUrl = await exportToPng(document.getElementById('my-element'), {
 *   pixelRatio: 2
 * });
 * ```
 */
export async function exportToPng(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<string> {
  if (!element) {
    throw new Error('Element is required for PNG export');
  }

  const htmlToImageOptions = toHtmlToImageOptions(options, false);
  return toPng(element, htmlToImageOptions);
}

/**
 * Export an HTML element as a JPEG data URL
 *
 * @param element - The HTML element to export
 * @param options - Export options (backgroundColor defaults to white)
 * @returns Promise resolving to a JPEG data URL (base64)
 *
 * @example
 * ```ts
 * const dataUrl = await exportToJpeg(document.getElementById('my-element'), {
 *   quality: 0.9,
 *   backgroundColor: '#ffffff'
 * });
 * ```
 */
export async function exportToJpeg(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<string> {
  if (!element) {
    throw new Error('Element is required for JPEG export');
  }

  const htmlToImageOptions = toHtmlToImageOptions(options, true);
  return toJpeg(element, htmlToImageOptions);
}

/**
 * Export an HTML element as a Blob
 *
 * @param element - The HTML element to export
 * @param options - Export options
 * @returns Promise resolving to a Blob (PNG format)
 *
 * @example
 * ```ts
 * const blob = await exportToBlob(document.getElementById('my-element'));
 * // Use with FormData, URL.createObjectURL, etc.
 * ```
 */
export async function exportToBlob(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob | null> {
  if (!element) {
    throw new Error('Element is required for Blob export');
  }

  const htmlToImageOptions = toHtmlToImageOptions(options, false);
  return toBlob(element, htmlToImageOptions);
}

/**
 * Export an HTML element as a Canvas
 *
 * @param element - The HTML element to export
 * @param options - Export options
 * @returns Promise resolving to an HTMLCanvasElement
 *
 * @example
 * ```ts
 * const canvas = await exportToCanvas(document.getElementById('my-element'));
 * // Further manipulate canvas, draw on it, etc.
 * ```
 */
export async function exportToCanvas(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<HTMLCanvasElement> {
  if (!element) {
    throw new Error('Element is required for Canvas export');
  }

  const htmlToImageOptions = toHtmlToImageOptions(options, false);
  return toCanvas(element, htmlToImageOptions);
}

/**
 * Download an image from a data URL
 *
 * @param dataUrl - The data URL (from exportToPng or exportToJpeg)
 * @param filename - The filename for the download (include extension)
 *
 * @example
 * ```ts
 * const dataUrl = await exportToPng(element);
 * downloadImage(dataUrl, 'my-export.png');
 * ```
 */
export function downloadImage(dataUrl: string, filename: string): void {
  if (!dataUrl) {
    throw new Error('Data URL is required for download');
  }
  if (!filename) {
    throw new Error('Filename is required for download');
  }

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download a Blob as a file
 *
 * @param blob - The Blob to download
 * @param filename - The filename for the download (include extension)
 *
 * @example
 * ```ts
 * const blob = await exportToBlob(element);
 * if (blob) downloadBlob(blob, 'my-export.png');
 * ```
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (!blob) {
    throw new Error('Blob is required for download');
  }
  if (!filename) {
    throw new Error('Filename is required for download');
  }

  const url = URL.createObjectURL(blob);
  downloadImage(url, filename);
  URL.revokeObjectURL(url);
}

/**
 * Capture exactly what's visible in a container element (the viewport).
 * Perfect for image editors, canvas apps, or any scrollable content area
 * where you want to export exactly what the user sees.
 *
 * @param container - The container element (e.g., a div with overflow:hidden/scroll)
 * @param options - Viewport capture options
 * @returns Promise resolving to a data URL (PNG or JPEG)
 *
 * @example
 * ```ts
 * // Capture the visible area of a design canvas
 * const canvas = document.getElementById('design-canvas');
 * const dataUrl = await captureViewport(canvas, {
 *   pixelRatio: 2,
 *   format: 'png'
 * });
 *
 * // Capture a specific region within the viewport
 * const dataUrl = await captureViewport(canvas, {
 *   region: { x: 100, y: 100, width: 400, height: 300 }
 * });
 * ```
 */
export async function captureViewport(
  container: HTMLElement,
  options: ViewportOptions = {}
): Promise<string> {
  if (!container) {
    throw new Error('Container element is required for viewport capture');
  }

  const {
    format = 'png',
    hideScrollbars = true,
    region,
    pixelRatio = DEFAULT_PIXEL_RATIO,
    ...restOptions
  } = options;

  // Store original styles to restore later
  const originalOverflow = container.style.overflow;
  const originalScrollbarWidth = container.style.scrollbarWidth;
  const originalWebkitScrollbar = container.style.getPropertyValue('--webkit-scrollbar-display');

  try {
    // Hide scrollbars if requested
    if (hideScrollbars) {
      container.style.scrollbarWidth = 'none'; // Firefox
      // For webkit browsers, we'll use a class approach
      container.classList.add('__capture-hide-scrollbars');

      // Inject scrollbar-hiding CSS if not already present
      if (!document.getElementById('__capture-viewport-styles')) {
        const style = document.createElement('style');
        style.id = '__capture-viewport-styles';
        style.textContent = `
          .__capture-hide-scrollbars::-webkit-scrollbar {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Get the visible dimensions
    const visibleWidth = container.clientWidth;
    const visibleHeight = container.clientHeight;

    // First, capture the full container to a canvas
    const fullCanvas = await toCanvas(container, {
      ...toHtmlToImageOptions({ ...restOptions, pixelRatio }, format === 'jpeg'),
      width: visibleWidth,
      height: visibleHeight,
    });

    // If a specific region is requested, crop to that region
    if (region) {
      const croppedCanvas = document.createElement('canvas');
      const scaledRegion = {
        x: region.x * pixelRatio,
        y: region.y * pixelRatio,
        width: region.width * pixelRatio,
        height: region.height * pixelRatio,
      };

      croppedCanvas.width = scaledRegion.width;
      croppedCanvas.height = scaledRegion.height;

      const ctx = croppedCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw the cropped region
      ctx.drawImage(
        fullCanvas,
        scaledRegion.x,
        scaledRegion.y,
        scaledRegion.width,
        scaledRegion.height,
        0,
        0,
        scaledRegion.width,
        scaledRegion.height
      );

      // Export the cropped canvas
      if (format === 'jpeg') {
        return croppedCanvas.toDataURL('image/jpeg', restOptions.quality ?? DEFAULT_JPEG_QUALITY);
      }
      return croppedCanvas.toDataURL('image/png');
    }

    // Export the full viewport canvas
    if (format === 'jpeg') {
      return fullCanvas.toDataURL('image/jpeg', restOptions.quality ?? DEFAULT_JPEG_QUALITY);
    }
    return fullCanvas.toDataURL('image/png');

  } finally {
    // Restore original styles
    container.style.overflow = originalOverflow;
    container.style.scrollbarWidth = originalScrollbarWidth;
    if (originalWebkitScrollbar) {
      container.style.setProperty('--webkit-scrollbar-display', originalWebkitScrollbar);
    }
    container.classList.remove('__capture-hide-scrollbars');
  }
}

/**
 * Get information about the visible viewport of a container.
 * Useful for understanding what will be captured before calling captureViewport.
 *
 * @param container - The container element
 * @returns Viewport information including dimensions and scroll position
 *
 * @example
 * ```ts
 * const info = getViewportInfo(container);
 * console.log(`Visible area: ${info.visibleWidth}x${info.visibleHeight}`);
 * console.log(`Scroll position: ${info.scrollLeft}, ${info.scrollTop}`);
 * console.log(`Total content: ${info.scrollWidth}x${info.scrollHeight}`);
 * ```
 */
export function getViewportInfo(container: HTMLElement): {
  visibleWidth: number;
  visibleHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;
  isScrollable: boolean;
  hasHorizontalScroll: boolean;
  hasVerticalScroll: boolean;
} {
  if (!container) {
    throw new Error('Container element is required');
  }

  const visibleWidth = container.clientWidth;
  const visibleHeight = container.clientHeight;
  const scrollWidth = container.scrollWidth;
  const scrollHeight = container.scrollHeight;

  return {
    visibleWidth,
    visibleHeight,
    scrollLeft: container.scrollLeft,
    scrollTop: container.scrollTop,
    scrollWidth,
    scrollHeight,
    isScrollable: scrollWidth > visibleWidth || scrollHeight > visibleHeight,
    hasHorizontalScroll: scrollWidth > visibleWidth,
    hasVerticalScroll: scrollHeight > visibleHeight,
  };
}

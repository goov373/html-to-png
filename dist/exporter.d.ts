import type { ExportOptions, ViewportOptions } from './types';
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
export declare function exportToPng(element: HTMLElement, options?: ExportOptions): Promise<string>;
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
export declare function exportToJpeg(element: HTMLElement, options?: ExportOptions): Promise<string>;
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
export declare function exportToBlob(element: HTMLElement, options?: ExportOptions): Promise<Blob | null>;
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
export declare function exportToCanvas(element: HTMLElement, options?: ExportOptions): Promise<HTMLCanvasElement>;
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
export declare function downloadImage(dataUrl: string, filename: string): void;
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
export declare function downloadBlob(blob: Blob, filename: string): void;
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
export declare function captureViewport(container: HTMLElement, options?: ViewportOptions): Promise<string>;
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
export declare function getViewportInfo(container: HTMLElement): {
    visibleWidth: number;
    visibleHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    isScrollable: boolean;
    hasHorizontalScroll: boolean;
    hasVerticalScroll: boolean;
};
//# sourceMappingURL=exporter.d.ts.map
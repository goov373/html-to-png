/**
 * Options for PNG/JPEG export
 */
export interface ExportOptions {
  /**
   * Pixel ratio for high-DPI displays (1, 2, or 3)
   * @default 2
   */
  pixelRatio?: number;

  /**
   * JPEG quality (0-1, only applies to JPEG export)
   * @default 0.95
   */
  quality?: number;

  /**
   * Background color (required for JPEG to avoid transparency issues)
   * @default '#ffffff' for JPEG, undefined for PNG
   */
  backgroundColor?: string;

  /**
   * Filter function to exclude certain nodes from export
   * Return false to exclude the node
   */
  filter?: (node: HTMLElement) => boolean;

  /**
   * Width override (in pixels)
   */
  width?: number;

  /**
   * Height override (in pixels)
   */
  height?: number;

  /**
   * Skip fonts embedding (faster but may have font issues)
   * @default false
   */
  skipFonts?: boolean;
}

/**
 * Result from export operations
 */
export interface ExportResult {
  /** The data URL or blob from the export */
  data: string | Blob;
  /** Width of the exported image */
  width: number;
  /** Height of the exported image */
  height: number;
}

/**
 * Options for viewport capture
 */
export interface ViewportOptions extends ExportOptions {
  /**
   * Output format
   * @default 'png'
   */
  format?: 'png' | 'jpeg';

  /**
   * Whether to hide scrollbars in the export
   * @default true
   */
  hideScrollbars?: boolean;

  /**
   * Capture a specific region within the viewport (relative to container)
   * If not specified, captures the entire visible area
   */
  region?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

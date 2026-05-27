/**
 * External knowledge source — linked, not imported.
 */

export interface Book {
  id: string;
  title: string;
  source: string;
  tags: string[];
  /** 1–5 from local ratings store; undefined if unrated */
  rating?: number;
}

export type BookRating = 1 | 2 | 3 | 4 | 5;

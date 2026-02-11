import type { IElement } from './element.js';

/**
 * A single canvas page within a journal.
 */
export interface IPage {
  id: string;
  journalId: string;
  title?: string;
  sortOrder: number;
  width: number;
  height: number;
  backgroundColor: string;
  elements: IElement[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a new page.
 */
export interface IPageCreate {
  journalId: string;
  title?: string;
  sortOrder?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

/**
 * Payload for updating an existing page.
 */
export type IPageUpdate = Partial<
  Pick<IPage, 'title' | 'sortOrder' | 'width' | 'height' | 'backgroundColor' | 'elements'>
>;

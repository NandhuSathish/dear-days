/**
 * Core journal entity — a scrapbook-style digital journal containing pages.
 */
export interface IJournal {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  ownerId: string;
  pageIds: string[];
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a new journal.
 */
export interface IJournalCreate {
  title: string;
  description?: string;
  coverImageUrl?: string;
  tags?: string[];
  isPublic?: boolean;
}

/**
 * Payload for updating an existing journal.
 */
export type IJournalUpdate = Partial<
  Pick<IJournal, 'title' | 'description' | 'coverImageUrl' | 'tags' | 'isPublic'>
>;

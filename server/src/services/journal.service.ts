import type { IJournalCreate, IJournalUpdate, IPageCreate, IPageUpdate } from '@dear-days/shared';
import Journal, { type IJournalDocument } from '../models/journal.model.js';
import Page from '../models/page.model.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Verify the journal exists and belongs to the requesting user.
 */
function assertOwnership(journal: IJournalDocument | null, journalId: string, ownerId: string): asserts journal is IJournalDocument {
  if (!journal) {
    throw new AppError('Journal not found', 404, 'NOT_FOUND');
  }
  if (journal.ownerId.toString() !== ownerId) {
    throw new AppError('You do not have access to this journal', 403, 'FORBIDDEN');
  }
}

/**
 * Create a new journal for the authenticated user.
 */
export async function createJournal(ownerId: string, data: IJournalCreate) {
  const journal = await Journal.create({ ...data, ownerId });
  return journal.toJSON();
}

/**
 * List all journals owned by the authenticated user.
 */
export async function getJournalsByOwner(ownerId: string) {
  const journals = await Journal.find({ ownerId }).sort({ updatedAt: -1 });
  return journals.map((j) => j.toJSON());
}

/**
 * Get a single journal by ID with ownership check.
 */
export async function getJournalById(journalId: string, ownerId: string) {
  const journal = await Journal.findById(journalId);
  assertOwnership(journal, journalId, ownerId);
  return journal.toJSON();
}

/**
 * Update a journal's editable fields with ownership check.
 */
export async function updateJournal(journalId: string, ownerId: string, data: IJournalUpdate) {
  const journal = await Journal.findById(journalId);
  assertOwnership(journal, journalId, ownerId);

  const updated = await Journal.findByIdAndUpdate(journalId, { $set: data }, { new: true, runValidators: true });
  return updated!.toJSON();
}

/**
 * Delete a journal and all of its pages with ownership check.
 */
export async function deleteJournal(journalId: string, ownerId: string) {
  const journal = await Journal.findById(journalId);
  assertOwnership(journal, journalId, ownerId);

  await Page.deleteMany({ journalId });
  await journal.deleteOne();
}

/**
 * Add a new page to a journal with ownership check.
 */
export async function addPage(journalId: string, ownerId: string, data: Omit<IPageCreate, 'journalId'>) {
  const journal = await Journal.findById(journalId);
  assertOwnership(journal, journalId, ownerId);

  const sortOrder = data.sortOrder ?? journal.pageIds.length;
  const page = await Page.create({ ...data, journalId, sortOrder });

  journal.pageIds.push(page._id);
  await journal.save();

  return page.toJSON();
}

/**
 * Update an existing page within a journal with ownership check.
 */
export async function updatePage(journalId: string, pageId: string, ownerId: string, data: IPageUpdate) {
  const journal = await Journal.findById(journalId);
  assertOwnership(journal, journalId, ownerId);

  const isPageInJournal = journal.pageIds.some((pid) => pid.toString() === pageId);
  if (!isPageInJournal) {
    throw new AppError('Page does not belong to this journal', 404, 'NOT_FOUND');
  }

  const updated = await Page.findByIdAndUpdate(pageId, { $set: data }, { new: true, runValidators: true });
  if (!updated) {
    throw new AppError('Page not found', 404, 'NOT_FOUND');
  }

  return updated.toJSON();
}

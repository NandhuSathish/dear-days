import type { Request, Response, NextFunction } from 'express';
import type { IApiResponse, IJournalCreate, IJournalUpdate, IPageCreate, IPageUpdate } from '@dear-days/shared';
import * as journalService from '../services/journal.service.js';

/**
 * POST /journals — Create a new journal.
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: IJournalCreate = req.body;
    const journal = await journalService.createJournal(req.user!.id, data);

    const response: IApiResponse<typeof journal> = { success: true, data: journal };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /journals — List all journals for the authenticated user.
 */
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const journals = await journalService.getJournalsByOwner(req.user!.id);

    const response: IApiResponse<typeof journals> = { success: true, data: journals };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /journals/:id — Get a single journal by ID.
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const journal = await journalService.getJournalById(id, req.user!.id);

    const response: IApiResponse<typeof journal> = { success: true, data: journal };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /journals/:id — Update a journal.
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const data: IJournalUpdate = req.body;
    const journal = await journalService.updateJournal(id, req.user!.id, data);

    const response: IApiResponse<typeof journal> = { success: true, data: journal };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /journals/:id — Delete a journal and all its pages.
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await journalService.deleteJournal(id, req.user!.id);

    const response: IApiResponse = { success: true, message: 'Journal deleted successfully' };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /journals/:id/pages — Add a page to a journal.
 */
export async function addPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const data: Omit<IPageCreate, 'journalId'> = req.body;
    const page = await journalService.addPage(id, req.user!.id, data);

    const response: IApiResponse<typeof page> = { success: true, data: page };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /journals/:id/pages/:pageId — Update a page within a journal.
 */
export async function updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const pageId = req.params.pageId as string;
    const data: IPageUpdate = req.body;
    const page = await journalService.updatePage(id, pageId, req.user!.id, data);

    const response: IApiResponse<typeof page> = { success: true, data: page };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

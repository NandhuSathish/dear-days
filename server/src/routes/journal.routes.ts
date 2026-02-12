import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import * as journalCtrl from '../controllers/journal.controller.js';

const router = Router();

// All journal routes require authentication
router.use(authenticate);

/* ──────────────────────────── Journals ──────────────────────────── */

/**
 * @swagger
 * /journals:
 *   post:
 *     tags: [Journals]
 *     summary: Create a new journal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalCreate'
 *     responses:
 *       201:
 *         description: Journal created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalApiResponse'
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title must be at most 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be at most 500 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').optional().isString().withMessage('Each tag must be a string'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  validateRequest,
  journalCtrl.create,
);

/**
 * @swagger
 * /journals:
 *   get:
 *     tags: [Journals]
 *     summary: List all journals for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of journals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalListApiResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', journalCtrl.list);

/**
 * @swagger
 * /journals/{id}:
 *   get:
 *     tags: [Journals]
 *     summary: Get a journal by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal ID
 *     responses:
 *       200:
 *         description: Journal details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not your journal
 *       404:
 *         description: Journal not found
 */
router.get('/:id', journalCtrl.getById);

/**
 * @swagger
 * /journals/{id}:
 *   put:
 *     tags: [Journals]
 *     summary: Update a journal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalUpdate'
 *     responses:
 *       200:
 *         description: Journal updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Journal not found
 *       422:
 *         description: Validation error
 */
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Title must be at most 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be at most 500 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').optional().isString().withMessage('Each tag must be a string'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  validateRequest,
  journalCtrl.update,
);

/**
 * @swagger
 * /journals/{id}:
 *   delete:
 *     tags: [Journals]
 *     summary: Delete a journal and all its pages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal ID
 *     responses:
 *       200:
 *         description: Journal deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Journal deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Journal not found
 */
router.delete('/:id', journalCtrl.remove);

/* ──────────────────────────── Pages ──────────────────────────── */

/**
 * @swagger
 * /journals/{id}/pages:
 *   post:
 *     tags: [Pages]
 *     summary: Add a page to a journal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PageCreate'
 *     responses:
 *       201:
 *         description: Page created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Journal not found
 *       422:
 *         description: Validation error
 */
router.post(
  '/:id/pages',
  [
    body('title').optional().trim().isString().withMessage('Title must be a string'),
    body('sortOrder').optional().isInt({ min: 0 }).withMessage('sortOrder must be a non-negative integer'),
    body('width').optional().isInt({ min: 1 }).withMessage('Width must be a positive integer'),
    body('height').optional().isInt({ min: 1 }).withMessage('Height must be a positive integer'),
    body('backgroundColor').optional().isString().withMessage('backgroundColor must be a string'),
  ],
  validateRequest,
  journalCtrl.addPage,
);

/**
 * @swagger
 * /journals/{id}/pages/{pageId}:
 *   put:
 *     tags: [Pages]
 *     summary: Update a page within a journal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal ID
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PageUpdate'
 *     responses:
 *       200:
 *         description: Page updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageApiResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Page not found or does not belong to this journal
 *       422:
 *         description: Validation error
 */
router.put(
  '/:id/pages/:pageId',
  [
    body('title').optional().trim().isString().withMessage('Title must be a string'),
    body('sortOrder').optional().isInt({ min: 0 }).withMessage('sortOrder must be a non-negative integer'),
    body('width').optional().isInt({ min: 1 }).withMessage('Width must be a positive integer'),
    body('height').optional().isInt({ min: 1 }).withMessage('Height must be a positive integer'),
    body('backgroundColor').optional().isString().withMessage('backgroundColor must be a string'),
    body('elements').optional().isArray().withMessage('Elements must be an array'),
  ],
  validateRequest,
  journalCtrl.updatePage,
);

export default router;

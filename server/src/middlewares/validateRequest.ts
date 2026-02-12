import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import type { IApiResponse, IApiError } from '@dear-days/shared';

/**
 * Middleware that checks express-validator results.
 * Returns 422 with structured field errors if validation fails.
 */
export function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const result = validationResult(req);

  if (result.isEmpty()) {
    next();
    return;
  }

  const errors: IApiError[] = result.array().map((err) => ({
    field: err.type === 'field' ? err.path : undefined,
    message: err.msg as string,
    code: 'VALIDATION_ERROR',
  }));

  const response: IApiResponse = {
    success: false,
    message: 'Validation failed',
    errors,
  };

  res.status(422).json(response);
}

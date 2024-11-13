import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateHotel = [
  check('title').notEmpty().withMessage('Title is required'),
  check('description').notEmpty().withMessage('Description is required'),
  (req: Request, res: Response, next: NextFunction) : Response | void=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];



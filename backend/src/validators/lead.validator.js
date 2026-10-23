import { body, query } from 'express-validator';
import { LEAD_STATUSES } from '../models/Lead.js';

export const createLeadValidator = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('company').optional().trim(),
  body('serviceInterested')
    .trim()
    .notEmpty()
    .withMessage('Service interested is required'),
  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('followUpDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Follow-up date must be a valid ISO8601 date'),
  body('notes').optional().trim(),
];

export const updateLeadValidator = [
  body('name').optional().trim().notEmpty().withMessage('Lead name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
  body('company').optional().trim(),
  body('serviceInterested').optional().trim().notEmpty().withMessage('Service interested cannot be empty'),
  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('followUpDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Follow-up date must be a valid ISO8601 date'),
  body('notes').optional().trim(),
];

export const leadQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('status')
    .optional()
    .custom((val) => {
      if (val === 'All' || LEAD_STATUSES.includes(val)) return true;
      throw new Error(`Status must be 'All' or one of: ${LEAD_STATUSES.join(', ')}`);
    }),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date format'),
];

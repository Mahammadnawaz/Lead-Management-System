import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller.js';
import {
  createLeadValidator,
  updateLeadValidator,
  leadQueryValidator,
} from '../validators/lead.validator.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(leadQueryValidator, handleValidationErrors, getLeads)
  .post(createLeadValidator, handleValidationErrors, createLead);

router
  .route('/:id')
  .get(getLeadById)
  .put(updateLeadValidator, handleValidationErrors, updateLead)
  .delete(deleteLead);

export default router;

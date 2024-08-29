import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import BookingValidationSchema from './booking.validation';
import { BookingControllers } from './booking.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(BookingValidationSchema),
  BookingControllers.createBooking,
);

router.get('/', auth('admin'), BookingControllers.getAllBooking);
router.get('/:user', auth('user'), BookingControllers.getUserBooking);
router.delete('/:id', auth('user'), BookingControllers.cancelBooking);

export const BookingRoutes = router;

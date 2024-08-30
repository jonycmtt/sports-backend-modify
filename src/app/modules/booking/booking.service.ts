import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { Facility } from '../facility/facility.model';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import { bookingUtils } from './booking.utils';

const createBookingIntoDB = async (payload: TBooking) => {
  const { facility, date, startTime, endTime, user } = payload;
  const existingFacility = await Facility.findById(facility);

  if (!existingFacility) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility not found!');
  }

  const currentDate = new Date(payload.date);
  const toDay = new Date();
  const inputYear = payload.date.split('-');
  if (
    inputYear[0].length !== 4 ||
    !(Number(inputYear[1]) <= 12) ||
    Number(inputYear[1]) === 0 ||
    Number(inputYear[2]) === 0 ||
    !(Number(inputYear[2]) <= 31)
  ) {
    throw new Error(
      'Invalid date format! You must provide a date in YYYY-MM-DD format!!',
    );
  }

  // Calculate payable amount
  const pricePerHour = existingFacility.pricePerHour;
  const startDate = new Date(date + 'T' + startTime);
  const endDate = new Date(date + 'T' + endTime);
  const durationInHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const payableAmount = durationInHours * pricePerHour;

  const currentBookingHistory = await Booking.find({
    date: payload.date,
  }).select('startTime endTime date');

  const newTime = {
    startTime: payload.startTime,
    endTime: payload.endTime,
  };
  const isNotTimeFree = bookingUtils.doesOverlap(
    currentBookingHistory,
    newTime,
  );

  if (isNotTimeFree) {
    throw new Error('Time is already overlapped!!');
  }

  if (currentDate < toDay) {
    throw new Error('Date is out of range');
  }

  return await Booking.create({
    facility: facility,
    date,
    startTime,
    endTime,
    user,
    payableAmount,
  });
};

const getAllBookingFromDB = async () => {
  const result = await Booking.find().populate('facility').populate('user');
  return result;
};
const getUserBookingFromDB = async (user: string) => {
  return await Booking.find({ user }).populate('facility');
};

const cancelBookingFromDB = async (id: string) => {
  const ixExistFacilityData = await Booking.findById(id);
  if (!ixExistFacilityData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking data is not found!');
  }

  return await Booking.findByIdAndUpdate(
    id,
    {
      isBooked: 'canceled',
    },
    {
      new: true,
    },
  ).populate('facility');
};

// const checkAvailabilityService = async (date: Date) => {
//   try {
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     // Find bookings for the specified date
//     const bookings = await Booking.find({
//       date: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//       isBooked: 'confirmed', // Only consider confirmed bookings
//     }).select('startTime endTime');

//     // Assuming facility operates from 08:00 to 18:00 with 2-hour slots
//     const availableSlots = generateAvailableTimeSlots('08:00', '18:00', 2); // Customize based on your business logic

//     // Remove booked slots from available slots
//     for (const booking of bookings) {
//       const index = availableSlots.findIndex(
//         (slot) =>
//           slot.startTime === booking.startTime &&
//           slot.endTime === booking.endTime,
//       );
//       if (index !== -1) {
//         availableSlots.splice(index, 1); // Remove booked slot
//       }
//     }

//     return availableSlots;
//   } catch (error) {
//     throw new Error('Failed to fetch availability');
//   }
// };

// // Helper function to generate time slots
// const generateAvailableTimeSlots = (
//   startTime: string,
//   endTime: string,
//   slotDurationInHours: number,
// ): { startTime: string; endTime: string }[] => {
//   const slots: { startTime: string; endTime: string }[] = [];
//   let currentSlotStart = new Date(`2000-01-01T${startTime}:00Z`);
//   const end = new Date(`2000-01-01T${endTime}:00Z`);

//   while (currentSlotStart < end) {
//     const currentSlotEnd = new Date(
//       currentSlotStart.getTime() + slotDurationInHours * 60 * 60 * 1000,
//     );
//     slots.push({
//       startTime: formatTime(currentSlotStart),
//       endTime: formatTime(currentSlotEnd),
//     });
//     currentSlotStart = currentSlotEnd;
//   }

//   return slots;
// };

// // Helper function to format time in HH:mm format
// const formatTime = (date: Date): string => {
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   return `${hours}:${minutes}`;
// };

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingFromDB,
  getUserBookingFromDB,
  cancelBookingFromDB,
};

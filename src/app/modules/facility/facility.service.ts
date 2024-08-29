/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TFacility } from './facility.interface';
import { Facility } from './facility.model';
import { productSearchableFields } from './facility.constant';

const createFacilityIntoDB = async (payload: TFacility) => {
  return await Facility.create(payload);
};
const getFacilityFromDB = async (query: Record<string, unknown>) => {
  console.log(query);
  try {
    const { page = 1, limit = 10, search = '', minPrice, maxPrice } = query;

    const queryField: any = {};

    if (search) {
      // search
      queryField.$or = productSearchableFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    // filter
    if (minPrice || maxPrice) {
      queryField.pricePerHour = {};
      if (minPrice) queryField.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) queryField.pricePerHour.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const result = await Facility.find(queryField)
      .skip(skip)
      .limit(Number(limit))
      .exec();
    // Total number of documents matching the query
    const total = await Facility.countDocuments(queryField);

    // Meta information for pagination
    const meta = {
      total, // Total number of facilities
      page: Number(page), // Current page
      limit: Number(limit), // Number of items per page
      totalPages: Math.ceil(total / Number(limit)), // Total number of pages
    };

    return { data: result, meta };
  } catch (error) {
    throw new AppError(httpStatus.NOT_FOUND, 'not found');
  }
};
const getSingleFacilityFromDB = async (id: string) => {
  const result = await Facility.findById(id).exec();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility data is not found!');
  }
  return result;
};
const updateFacilityIntoDB = async (
  id: string,
  payload: Partial<TFacility>,
) => {
  const ixExistFacilityData = await Facility.findById(id);
  if (!ixExistFacilityData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility data is not found!');
  }
  return await Facility.findByIdAndUpdate(id, payload, {
    new: true,
  }).exec();
};
const deleteFacilityIntoDB = async (id: string) => {
  const ixExistFacilityData = await Facility.findById(id);
  if (!ixExistFacilityData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility data is not found!');
  }
  return await Facility.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  ).exec();
};

export const FacilityServices = {
  createFacilityIntoDB,
  getFacilityFromDB,
  getSingleFacilityFromDB,
  updateFacilityIntoDB,
  deleteFacilityIntoDB,
};

import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

const signUpIntoDB = async (payload: TUser) => {
  return await User.create(payload);
};
const getAllUsersIntoDB = async () => {
  return await User.find();
};
const getSingleUsersIntoDB = async (id: string) => {
  return await User.findById(id);
};

const loginFromDB = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  const isPasswordMatch = await bcrypt.compare(password, user?.password);

  if (!isPasswordMatch) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This user password is incorrect!',
    );
  }

  // create token send to client

  const jwtPayload = {
    role: user.role,
    user,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    user,
  };
};

export const UserServices = {
  signUpIntoDB,
  loginFromDB,
  getAllUsersIntoDB,
  getSingleUsersIntoDB,
};

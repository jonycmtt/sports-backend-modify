import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const signUp = catchAsync(async (req, res) => {
  const result = await UserServices.signUpIntoDB(req.body);

  const {
    _id,
    name,
    email: userEmail,
    role,
    phone,
    address,
    profilePic,
  } = result;
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User SignUp successfully',
    data: {
      _id,
      name,
      email: userEmail,
      role,
      phone,
      address,
      profilePic,
    },
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User finding successfully',
    data: result,
  });
});
const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUsersIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User finding successfully',
    data: result,
  });
});
const login = catchAsync(async (req, res) => {
  const { email: paramEmail, password } = req.body;
  const result = await UserServices.loginFromDB(paramEmail, password);

  const { _id, name, email, role, phone, address } = result.user;

  // Set cookie here
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true, // Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    sameSite: 'none', // Can be 'Lax' or 'None' depending on your use case
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    token: result.accessToken,
    data: { _id, name, email, role, phone, address },
  });
});

export const UserControllers = { signUp, login, getAllUser, getSingleUser };

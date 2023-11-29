import { TUser } from './user.interface';
import { UserModel } from './user.model';

async function addSingleUserToDB(userData: TUser) {
  if (await UserModel.isUserExist(userData.userId)) {
    throw new Error('User already exists');
  }
  return await UserModel.create(userData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}
async function getUsers() {
  return await UserModel.aggregate([
    {
      $project: {
        _id: 0,
        username: 1,
        fullName: { firstName: 1, lastName: 1 },
        age: 1,
        email: 1,
        address: { street: 1, city: 1, country: 1 },
      },
    },
  ]);
}

async function getUserById(userId: number) {
  if (!(await UserModel.isUserExist(userId))) {
    return null;
  }
  return await UserModel.findOne(
    { userId },
    {
      _id: 0,
      password: 0,
      'fullName._id': 0,
      'address._id': 0,
      createdAt: 0,
      updatedAt: 0,
      orders: 0,
      __v: 0,
    },
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getUserByFilter(filter: any) {
  return await UserModel.aggregate([
    {
      $match: filter,
      $project: {
        _id: 0,
        username: 1,
        fullName: { firstName: 1, lastName: 1 },
        age: 1,
        email: 1,
        address: { street: 1, city: 1, country: 1 },
      },
    },
  ]);
}

export const UserService = {
  addSingleUserToDB,
  getUsers,
  getUserByFilter,
  getUserById,
};

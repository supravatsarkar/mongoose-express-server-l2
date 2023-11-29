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
  return await UserModel.find();
}

export const UserService = {
  addSingleUserToDB,
  getUsers,
};

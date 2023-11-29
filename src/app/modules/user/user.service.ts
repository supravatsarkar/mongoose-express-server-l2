import { TUser } from './user.interface';
import { UserModel } from './user.model';

async function addSingleUserToDB(userData: TUser) {
  return await UserModel.create(userData);
}
async function getUsers() {
  return await UserModel.find();
}

export const UserService = {
  addSingleUserToDB,
  getUsers,
};

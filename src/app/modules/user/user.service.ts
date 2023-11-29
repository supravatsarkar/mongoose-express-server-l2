import { UserModel } from './user.model';

async function getUsers() {
  return await UserModel.find();
}

export const StudentService = {
  getUsers,
};

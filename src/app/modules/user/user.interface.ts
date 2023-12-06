import { Model, Types } from 'mongoose';

export interface TOrder {
  productName: string;
  price: number;
  quantity: number;
}
export interface TAddress {
  street: string;
  city: string;
  country: string;
}

export interface TUser {
  userId: number;
  username: string;
  password: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address: TAddress;
  orders: Array<TOrder>;
  isDeleted: boolean;
}

export interface TUserModel extends Model<TUser> {
  isUserExist(
    // eslint-disable-next-line no-unused-vars
    id: number | string,
  ): Promise<
    TUser & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date }
  > | null;
}

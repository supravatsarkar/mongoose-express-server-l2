import { Model } from 'mongoose';

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
}

export interface TUserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(id: number | string): Promise<TUser> | null;
}

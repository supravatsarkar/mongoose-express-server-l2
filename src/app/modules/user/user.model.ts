import { Schema, model } from 'mongoose';
import { TUser, TAddress, TOrder, TUserModel } from './user.interface';

const addressSchema = new Schema<TAddress>({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});
const orderSchema = new Schema<TOrder>({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const userSchema = new Schema<TUser, TUserModel>(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: new Schema({
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      }),
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    hobbies: {
      type: [String],
      required: true,
      default: [],
    },
    address: {
      type: addressSchema,
      required: true,
    },
    orders: {
      type: [orderSchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.statics.isUserExist = async (userId: number) => {
  return UserModel.findOne({ userId });
};

export const UserModel = model<TUser, TUserModel>('user', userSchema);

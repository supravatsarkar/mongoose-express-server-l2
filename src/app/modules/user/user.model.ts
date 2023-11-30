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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.statics.isUserExist = async (userId: number) => {
  return UserModel.findOne({ userId });
};

userSchema.pre('save', async function (next) {
  const exit = await UserModel.find().or([
    { userId: this.userId },
    { username: this.username },
  ]);
  if (exit) {
    throw new Error('Duplicate userId or username');
  }
  next();
});
userSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  console.log('is this run');
  next();
});

export const UserModel = model<TUser, TUserModel>('user', userSchema);

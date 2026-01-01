import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER"
}

// export enum Status {
//   NONE = "NONE",
//   PENDING = "PENDING",
//   APPROVED = "APPROVED",
//   REJECTED = "REJECTED"
// }

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: Role[];
  // approved: Status;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Object.values(Role), default: [Role.CUSTOMER] },
    // approved: { type: String, enum: Object.values(Status), default: Status.NONE },
  },
  { timestamps: true } // creates createdAt and updatedAt automatically
);

// Password hashing pre-save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);


});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);

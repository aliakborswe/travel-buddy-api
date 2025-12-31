import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    profileImage: {
      type: String,
      default:
        "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=200",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    travelInterests: {
      type: [String],
      default: [],
    },
    visitedCountries: {
      type: [String],
      default: [],
    },
    currentLocation: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    subscriptionEndDate: {
      type: Date,
    },
    completedTripsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: { password?: unknown }) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    maxlength: 30,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 30,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "operator", "hr"],
    default: null,
  },
  category: {
    type: String,
    enum: ["alpha", "normal", "executive", "trainee"],
    default: "normal",
  },
  division: {
    type: String,
    enum: ["pc", "lc", "att", "os", "fs"],
    required: true,
  },
  sitename: {
    type: String,
  },
  company: {
    type: String,
    enum: [
      "EPPL",
      "PMO",
      "PMS",
      "EPC",
      "PCS",
      "EPPL-GJ",
      "EPPL-BLR",
      "EPPL-PN",
      "EPPL-GA",
      "EPPL-HYD",
    ],
    required: true,
  },
  blood: {
    type: String,
  },
  family: [
    {
      firstname: {
        type: String,
        maxlength: 30,
        trim: true,
      },
      lastname: {
        type: String,
        maxlength: 30,
        trim: true,
      },
      relation: {
        type: String,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
  ],
  images: {
    aadhar: {
      type: String,
      trim: true,
    },
    driving: {
      type: String,
      trim: true,
    },
    electricity: {
      type: String,
      trim: true,
    },
    pcc: {
      type: String,
      trim: true,
    },
    insurance: {
      type: String,
      trim: true,
    },
    passport: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
});

employeeSchema.pre("save", async function encryptPass(next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

employeeSchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;

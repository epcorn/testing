import mongoose from "mongoose";
import Employee from "./employeeModel.js";

const workdayStatusSchema = mongoose.Schema({
  date: {
    type: Date,
  },
  checkIns: {
    type: [{
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      employeeInfo: {
        firstname: {
          type: String,
          default: null,
        },
        lastname: {
          type: String,
          default: null,
        },
      },
      checkInTime: {
        type: Date,
        default: null,
      },
      scheduleType: {
        type: String,
        enum: ["full", "half"],
        default: null,
      },
      isPresent: {
        type: Boolean,
        default: false,
      },
      isLate: {
        type: Boolean,
        default: false,
      },
    }],
  },
});

workdayStatusSchema.methods.hasCheckInForEmployee = function (employeeId) {
  return this.checkIns.some(checkIn => checkIn.employeeId.equals(employeeId));
};

workdayStatusSchema.methods.getEmployeeCheckInData = function (employeeId) {
  return this.checkIns.find(checkIn => checkIn.employeeId.equals(employeeId));
};

workdayStatusSchema.methods.toggleScheduleType = async function (employeeId, type) {
  const checkInToUpdate = this.checkIns.find(checkIn => checkIn.employeeId.equals(employeeId));

  if (checkInToUpdate) {
    checkInToUpdate.scheduleType = type;
    await this.save();
    return checkInToUpdate;
  } else {
    throw new Error("Check-in document not found for the provided employeeId");
  }
};

workdayStatusSchema.methods.undoCheckIn = async function (employeeId) {
  const checkInToUpdate = this.checkIns.find(checkIn => checkIn.employeeId.equals(employeeId));
  if (checkInToUpdate) {
    checkInToUpdate.isPresent = false;
    checkInToUpdate.checkInTime = null;
    checkInToUpdate.scheduleType = null;
    checkInToUpdate.isLate = false;
    await this.save();
    return checkInToUpdate;
  } else {
    throw new Error("Check-in document not found for the provided employeeId");
  }
};
workdayStatusSchema.methods.checkIn = async function (employeeId) {
  const checkInToUpdate = this.checkIns.find(checkIn => checkIn.employeeId.equals(employeeId));
  if (checkInToUpdate) {
    checkInToUpdate.isPresent = true;
    checkInToUpdate.checkInTime = new Date;
    checkInToUpdate.scheduleType = "full";
    checkInToUpdate.isLate = false;
    await this.save();
    return checkInToUpdate;
  } else {
    throw new Error("Check-in document not found for the provided employeeId");
  }
};

workdayStatusSchema.methods.toggleLate = async function (employeeId) {
  const checkInToUpdate = this.checkIns.find(checkIn => checkIn.employeeId.equals(employeeId));

  if (checkInToUpdate) {
    checkInToUpdate.isLate = !checkInToUpdate.isLate;
    await this.save();
    return checkInToUpdate;
  } else {
    throw new Error("Check-in document not found for the provided employeeId");
  }
};

async function createOrUpdateWorkdayStatus() {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  let existingWorkdayStatus = await WorkdayStatus.findOne({ date: currentDate });

  if (!existingWorkdayStatus) {
    existingWorkdayStatus = new WorkdayStatus({ date: currentDate });

    const allEmployees = await Employee.find({}, '_id firstname lastname');

    // Map through employees to create check-ins with selected fields populated
    existingWorkdayStatus.checkIns = allEmployees.map(employee => ({
      employeeId: employee._id,
      employeeInfo: {
        firstname: employee.firstname,
        lastname: employee.lastname,
      },
    }));

    await existingWorkdayStatus.save();
  }
  return existingWorkdayStatus;
}


const addCheckInToWorkdayStatus = async (checkInData) => {
  const workdayStatus = await createOrUpdateWorkdayStatus();
  workdayStatus.checkIns.push(checkInData);
  await workdayStatus.save();
};

const WorkdayStatus = mongoose.model("WorkdayStatus", workdayStatusSchema);


export {
  WorkdayStatus,
  createOrUpdateWorkdayStatus,
  addCheckInToWorkdayStatus,
};

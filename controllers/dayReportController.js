import {
  createOrUpdateWorkdayStatus,
  WorkdayStatus,
} from "../models/dayReportModel.js";
import * as XLSX from "xlsx/xlsx.mjs";
import fs from "fs";
import Employee from "../models/employeeModel.js";

const todaysStatus = async (req, res, next) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Bad request: date is missing" });
    }

    const todayIs = new Date();
    todayIs.setUTCHours(0, 0, 0, 0);

    // Convert both dates to milliseconds since January 1, 1970
    const todayIsTimestamp = todayIs.getTime();
    const dateTimestamp = new Date(date).getTime();

    if (todayIsTimestamp < dateTimestamp) {
      return res
        .status(403)
        .json({ message: "The provided date is in the future", date });
    }

    if (todayIsTimestamp === dateTimestamp) {
      let workdayStatus = await WorkdayStatus.find({ date });
      if (workdayStatus.length === 0) {
        workdayStatus.push(await createOrUpdateWorkdayStatus());
      }
      return res.status(200).json({
        message: "Today's day Status",
        workdayStatus: workdayStatus[0],
        date,
      });
    }

    if (todayIsTimestamp > dateTimestamp) {
      const workdayStatus = await WorkdayStatus.find({ date });
      if (workdayStatus.length <= 0) {
        return res
          .status(404)
          .json({ message: "We do not have that old Data", date });
      }
      return res
        .status(200)
        .json({ message: "Old Status", workdayStatus: workdayStatus[0], date });
    }
  } catch (error) {
    next(error);
  }
};

const toogleCheckIn = async (req, res, next) => {
  try {
    const { empId } = req.params;
    const workdayStatus = await createOrUpdateWorkdayStatus();
    const obj = workdayStatus.checkIns.find((checkIn) =>
      checkIn.employeeId.equals(empId)
    );
    if (obj.isPresent) {
      const result = await workdayStatus.undoCheckIn(empId);
      return res.status(200).json({ message: `user makred absent`, result });
    } else {
      const result = await workdayStatus.checkIn(empId);
      return res.status(200).json({ message: `user marked present`, result });
    }
  } catch (error) {
    next(error);
  }
};

const changeDayScheduleType = async (req, res, next) => {
  try {
    const { empId } = req.params;
    const { type } = req.body;
    const workdayStatus = await createOrUpdateWorkdayStatus();
    const obj = workdayStatus.checkIns.find((checkIn) =>
      checkIn.employeeId.equals(empId)
    );
    if (obj.isPresent) {
      const result = await workdayStatus.toggleScheduleType(empId, type);
      return res.status(200).json({ message: "Sechedule changed!", result });
    } else {
      return res.status(400).json({ message: "User not present" });
    }
  } catch (error) {
    next(error);
  }
};

const markLate = async (req, res, next) => {
  try {
    const { empId } = req.params;
    const workdayStatus = await createOrUpdateWorkdayStatus();
    const obj = workdayStatus.checkIns.find((checkIn) =>
      checkIn.employeeId.equals(empId)
    );
    if (obj.isPresent) {
      const result = await workdayStatus.toggleLate(empId);
      return res.status(200).json({ message: "User marked late", result });
    } else {
      return res.status(200).json({ message: "User not present" });
    }
  } catch (error) {
    next(error);
  }
};

const reportType1 = async (req, res, next) => {
  const { empId, month, year } = req.body;
  try {
    const startDate = new Date(year, month - 1, 1); // First day of the month

    const endDate = new Date(year, month, 0); // Last day of the month

    const monthInWords = startDate.toLocaleString("default", { month: "long" });

    WorkdayStatus.find(
      {
        "checkIns.employeeId": empId,
        date: { $gte: startDate, $lt: endDate.setDate(endDate.getDate() + 1) },
      },
      { "checkIns.$": 1 }
    )
      .then((results) => {
        const workbook = XLSX.utils.book_new(); // Create a new workbook

        const filteredCheckIns = results.flatMap((doc) =>
          doc.checkIns.filter((checkin) => checkin.employeeId.equals(empId))
        );
        const worksheets = {};

        filteredCheckIns.forEach((checkIn) => {
          const { employeeInfo, checkInTime, scheduleType, isPresent, isLate } =
            checkIn;
          const firstName = employeeInfo ? employeeInfo.firstname : "Unknown";

          if (!worksheets[firstName]) {
            worksheets[firstName] = XLSX.utils.json_to_sheet([
              {
                Date: checkInTime,
                "Day Type": scheduleType,
                "Is Present": isPresent ? "Present" : "Absent",
                "Is Late": isLate ? "Late" : "",
              },
            ]);
            XLSX.utils.book_append_sheet(
              workbook,
              worksheets[firstName],
              firstName
            );
          } else {
            XLSX.utils.sheet_add_json(
              worksheets[firstName],
              [
                {
                  Date: checkInTime,
                  "Day Type": scheduleType,
                  "Is Present": isPresent ? "Present" : "Absent",
                  "Is Late": isLate ? "Late" : "",
                },
              ],
              { skipHeader: true, origin: -1 }
            );
          }
        });

        // Convert workbook to buffer
        const buffer = XLSX.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        });

        // Save buffer to file synchronously
        fs.writeFileSync(`${monthInWords}.xlsx`, buffer);

        res
          .status(200)
          .json({ message: "Excel sheet generated and saved successfully." });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    next(error);
  }
};

const megaReport = async (req, res, next) => {
  const { month, year } = req.body;

  try {
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month
    const monthInWords = startDate.toLocaleString("default", { month: "long" });

    const employees = await Employee.find({}, "_id");
    const workbook = XLSX.utils.book_new();
    const worksheets = {};

    // Process each employee's data sequentially
    for (const emp of employees) {
      const results = await WorkdayStatus.find(
        {
          "checkIns.employeeId": emp._id,
          date: {
            $gte: startDate,
            $lt: endDate.setDate(endDate.getDate() + 1),
          },
        },
        { "checkIns.$": 1 }
      );

      const filteredCheckIns = results.flatMap((doc) =>
        doc.checkIns.filter((checkin) => checkin.employeeId.equals(emp._id))
      );

      const employeeInfo = await Employee.findById(emp._id, "firstname");
      const firstName = employeeInfo ? employeeInfo.firstname : "Unknown";

      const worksheetData = filteredCheckIns.map((checkIn) => {
        const { checkInTime, scheduleType, isPresent, isLate } = checkIn;
        return {
          Date: checkInTime,
          "Day Type": scheduleType,
          "Is Present": isPresent ? "Present" : "Absent",
          "Is Late": isLate ? "Late" : "",
        };
      });

      if (!worksheets[firstName]) {
        worksheets[firstName] = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(
          workbook,
          worksheets[firstName],
          firstName
        );
      } else {
        XLSX.utils.sheet_add_json(worksheets[firstName], worksheetData, {
          skipHeader: true,
          origin: -1,
        });
      }
    }

    // Convert workbook to buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Save buffer to file synchronously
    fs.writeFileSync(`${monthInWords}.xlsx`, buffer);

    res
      .status(200)
      .json({ message: "Excel sheet generated and saved successfully." });
  } catch (error) {
    next(error);
  }
};
export {
  toogleCheckIn,
  changeDayScheduleType,
  markLate,
  todaysStatus,
  reportType1,
  megaReport,
};

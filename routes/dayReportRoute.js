import { Router } from "express";
import {
  toogleCheckIn,
  changeDayScheduleType,
  markLate,
  todaysStatus,
  reportType1,
  megaReport,
} from "../controllers/dayReportController.js";
import { ifOprator, verifyToken } from "../middleware/verifyUser.js";
const router = Router();

router.post("/status", verifyToken, ifOprator, todaysStatus);
router.post("/checkIn/:empId", verifyToken, ifOprator, toogleCheckIn);
router.post(
  "/changeDayScheduleType/:empId",
  verifyToken,
  ifOprator,
  changeDayScheduleType
);
router.post("/markLate/:empId", verifyToken, ifOprator, markLate);
router.post("/getReport", reportType1);

router.post("/megaReport", megaReport);

export default router;

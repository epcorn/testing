import { Router } from "express";
import dayReportRoute from "./dayReportRoute.js";
import employeeRoute from "./employeeRoute.js";

const router = Router();

router.use("/dayReport", dayReportRoute);
router.use("/employee", employeeRoute);

export default router;
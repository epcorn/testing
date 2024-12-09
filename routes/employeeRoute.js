import { Router } from "express";
import {
  login,
  logout,
  setHr,
  setAdmin,
  setOprator,
  newEmployee,
  allEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { ifAdmin, ifHr, verifyToken } from "../middleware/verifyUser.js";
import { reportType1 } from '../controllers/dayReportController.js';

const router = Router();

router.post("/login", login);

router.post("/setAdmin/:empId", verifyToken, ifAdmin, setAdmin);
router.post("/setOprator/:empId", verifyToken, ifAdmin, setOprator);
router.post("/setHr/:empId", verifyToken, ifAdmin, setHr);

router.post("/new", verifyToken, ifHr, newEmployee);
router.post("/logout", verifyToken, logout);
router.get("/", verifyToken, ifHr, allEmployee);
router.post("/:empId", verifyToken, ifHr, updateEmployee);
router.delete("/:empId", verifyToken, ifHr, deleteEmployee);


export default router;

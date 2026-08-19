import { Router, type IRouter } from "express";
import healthRouter from "./health";
import submitFormRouter from "./submit-form";

const router: IRouter = Router();

router.use(healthRouter);
router.use(submitFormRouter);

export default router;

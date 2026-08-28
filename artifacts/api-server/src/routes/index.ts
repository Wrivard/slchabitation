import { Router, type IRouter } from "express";
import healthRouter from "./health";
import submitFormRouter from "./submit-form";
import turnstileConfigRouter from "./turnstile-config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(turnstileConfigRouter);
router.use(submitFormRouter);

export default router;

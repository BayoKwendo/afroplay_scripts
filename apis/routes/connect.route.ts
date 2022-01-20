import { Router } from "https://deno.land/x/oak/mod.ts";
import testController from "../controllers/testController.ts";
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
  .get("/", authorize, testController.connectionPool)
  .post("/test", authorize, testController.postRequests)

  
export default router;

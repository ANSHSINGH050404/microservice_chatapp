import express from "express";
import { isAuth } from "../middlewares/isAuth";
import { createNewChat } from "../controllers/chat";


const router=express.Router()

router.post("/chat/new",isAuth,createNewChat)

export default router;


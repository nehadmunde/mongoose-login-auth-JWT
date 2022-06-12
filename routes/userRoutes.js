import express from "express";
const router =express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/authMiddleware.js";

//Router level middleware
router.use('/changepassword',checkUserAuth)

//public routes
router.post('/register',UserController.userRegistraion)
router.post('/login',UserController.userLogin)

//Protected routes
router.post('/changepassword',UserController.userResetPassword)

export default router
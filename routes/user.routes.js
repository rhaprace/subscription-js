import { Router } from "express";
import { getAllUsers, getUserById } from '../controllers/user.controller.js';
import authorize from "../middleware/auth.middleware.js";
const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', authorize, getUserById);

userRouter.post('/', (req, res) => res.send({title: 'CREATE new User'}));

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE User'}));

userRouter.delete('/:id', (req, res) => res.send({title: 'DELETE User'}));

export default userRouter;
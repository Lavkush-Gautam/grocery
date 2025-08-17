import express from 'express'
import { isAuth, Login, logout, Me, register } from '../controller/UserController.js'
import authUser from '../middleware/authUser.js'


const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', Login)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/me',Me)
userRouter.post('/logout', authUser, logout)


export default userRouter
import { Express } from 'express'
import taskRouter from './task.route'
import userRouter from './user.route'
import authMiddleware from '../middlewares/auth.middleware'

const route = (app: Express) => {
  const ver1 = '/api/v1'

  app.use(ver1 + "/tasks", authMiddleware, taskRouter)

  app.use(ver1 + "/users", userRouter)
}

export default route
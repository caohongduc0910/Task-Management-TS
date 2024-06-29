import { Router } from 'express'
const router: Router = Router()
import * as controller from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'

router.post('/register', controller.register)

router.post('/login', controller.login)

router.post('/password/forgot', controller.forgot)

router.post('/password/otp', controller.otp)

router.post('/password/reset', controller.reset)

router.get('/:id', authMiddleware, controller.detail)

router.get('/', authMiddleware, controller.getAll)

const userRouter = router
export default userRouter
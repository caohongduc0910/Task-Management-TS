import { Router } from 'express'
import * as controller from '../controllers/task.controller'
import authMiddleware from '../middlewares/auth.middleware'

const router: Router = Router()

router.get('/', authMiddleware, controller.getAll)

router.get('/:id', authMiddleware, controller.detail)

router.post('/', authMiddleware, controller.create)

router.patch('/:id', authMiddleware, controller.update)

router.delete('/:id', authMiddleware, controller.deleteTask)

router.patch('/change-status/:id', authMiddleware, controller.changeStatus)

router.patch('/change-multi', authMiddleware, controller.changeMulti)

const taskRouter: Router = router

export default taskRouter
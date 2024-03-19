import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

const router = Router()

router.get('/', MovieController.getAll)
router.post('/', MovieController.create)

router.get('/:id', MovieController.getById)
router.patch('/:id', MovieController.update)
router.delete('/:id', MovieController.delete)

export default router

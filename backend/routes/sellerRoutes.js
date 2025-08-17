import express from 'express'
import { sellerIsAuth, sellerLogin, sellerLogout } from '../controller/sellerController.js'
import authSeller from '../middleware/authSeller.js'

const router = express.Router()

router.post('/login', sellerLogin)
router.get('/is-auth', authSeller, sellerIsAuth)
router.post('/logout', authSeller, sellerLogout)

export default router
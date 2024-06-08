import express from 'express'
import {getWebPage} from '../controllers/chatController.js'

const router = express.Router()

router.get("/",getWebPage)

export default router


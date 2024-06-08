//maestro de rutas
import {Router} from 'express'
import chatRoutes from './chatRoutes.js'

const routerMaster = Router()  

routerMaster.use('/', chatRoutes)

export default routerMaster

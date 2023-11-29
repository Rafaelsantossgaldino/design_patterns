import { Router } from 'express';
import ProductController from '../controllers/ProductController';


const routes = Router();

routes.get('/api/products', ProductController.findall)
routes.post('/api/products', ProductController.create)


export default routes
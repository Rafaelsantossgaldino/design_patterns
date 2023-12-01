import { Router } from 'express';
import ProductController from '../controllers/ProductController';


const routes = Router(); 

routes.get('/api/products', ProductController.findall)
routes.get('/api/products/:id', ProductController.findOne)
routes.post('/api/products', ProductController.create)
routes.put('/api/products/:id', ProductController.update)
routes.delete('/api/products/:id', ProductController.delete)


export default routes
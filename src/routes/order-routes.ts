import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  getOrdersByProductId,
} from '../controllers/order-controller';

const router: Router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

router.get('/user/:userId', getOrdersByUserId);
router.get('/product/:productId', getOrdersByProductId);

export default router;

import express from 'express';
import controller from '../controllers/user';

const router = express.Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
export = router;

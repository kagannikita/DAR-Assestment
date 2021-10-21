import express from 'express';
import cors from 'cors';
import controller from '../controllers/category';
import upload from '../config/multer';

const router = express.Router();
router.get('/get', controller.getCategories);
router.get('/get/:id', controller.retrieveCategory);
router.post('/create', upload.single('image'), controller.createCategories);
router.delete('/delete/:id', controller.deleteCategory);
router.put('/put/:id', cors(), upload.single('image'), controller.updateCategory);
export = router;

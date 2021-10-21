import express from 'express';
import controller from '../controllers/card';
import upload from '../config/multer';

const router = express.Router();
router.get('/get', controller.getCards);
router.get('/get/:id', controller.retrieveCards);
router.post(
  '/create',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
    {
      name: 'audio',
      maxCount: 1,
    },
  ]),
  controller.createCards,
);
router.put(
  '/put/:id',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
    {
      name: 'audio',
      maxCount: 1,
    },
  ]),
  controller.updateCards,
);
router.delete('/delete/:id', controller.deleteCards);
export = router;

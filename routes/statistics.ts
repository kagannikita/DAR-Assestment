import express from 'express';
import controller from '../controllers/statistics';

const router = express.Router();
router.get('/get', controller.getStatistics);
router.get('/get/:id', controller.retrieveStatistics);
router.get('/sort', controller.sortStatistics);
router.post('/create', controller.createStatistics);
router.put('/put/:id', controller.updateStatistics);
router.delete('/delete/:id', controller.deleteStatistic);
export = router;

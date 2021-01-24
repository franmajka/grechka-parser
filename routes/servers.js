import Router from 'express';
import {getBuckweatData} from '../controllers/servers.js';

const router = Router();

router.get('/api/buckweat-data', getBuckweatData)

export default router

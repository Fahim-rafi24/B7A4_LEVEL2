import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getProfile } from '../controllers/auth.controller';

const router = Router();

router.get('/me', authenticate, getProfile);

// import { mediaUpload } from '../middlewares/media.middleware';
// import { sendError, sendSuccess } from '../utils/apiResponse.util';
// import { httpStatus } from '../config/http_status';

// router.post('/create_files', mediaUpload, (req, res) => {
//     try {
//         const list_of_urls = (req as any).list_of_urls;
//         // console.log(list_of_urls);

//         return sendSuccess(res, [{ list_of_urls }], httpStatus.CREATED, 'All Files Uploded Successfully');
//     } catch (error) {
//         return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user', error);
//     }
// });

export default router;

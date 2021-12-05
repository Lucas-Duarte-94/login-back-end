import { Router } from 'express';
import * as ApiController from '../controllers/apiController';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './temp')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'-'+Date.now())
    }
})

const upload = multer({
    dest: './temp',
    storage,
    fileFilter: (req, file, cb) => {
        const authorized: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
        cb(null, authorized.includes(file.mimetype));
    },
    limits: { fileSize: 4000000 }
})

const router = Router();

router.get('/ping', ApiController.ping );
router.get('/get-public-infos', ApiController.getPublicInfos);

router.post('/register', ApiController.register);
router.post('/login', ApiController.login);
router.post('/avatar-image', upload.single('avatar'), ApiController.uploadAvatarImage);
router.post('/update-info', ApiController.uploadInfos);

export default router;
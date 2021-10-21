import multer from 'multer';
import path from 'path';
import e from 'express';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter(req: e.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mp3') {
      callback(new Error('File type is not supported'));
      return;
    }
    callback(null, true);
  },
});

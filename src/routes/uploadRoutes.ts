import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload'; // Use named import here
 
const router = Router();
 

router.post('/uploads', upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
 
  const fileObject = {
    name: req.file.filename,
    path: req.file.path,
  };
 
  res.status(200).json(fileObject);
});
 
export default router;
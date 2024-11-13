import multer from 'multer';
import path from 'path';
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const fileName = `${file.originalname.split('.')[0]}-${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, fileName);
  },
});
 
export const upload = multer({ storage }); // Export as a named export
 
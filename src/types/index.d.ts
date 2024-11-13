
// import { Request } from 'express';
// import { File } from 'multer';
// declare namespace Express {
//     export interface Request {
//       user?: { id: string; email: string };
//     }
//   }
  

//   // src/types/index.d.ts

// declare global {
//   namespace Express {
//     interface Request {
//       file?: File;
//       files?: File[];
//     }
//   }
// }






// src/types/index.d.ts

// import { Request } from 'express';
// import { File } from 'multer';

// declare global {
//   namespace Express {
//     interface Request {
//       file?: File;
//       files?: File[];
//     }
//   }
// }





// src/types/index.d.ts

import { Request } from 'express';
import { File } from 'multer';
 
declare global {
  namespace Express {
    interface Request {
      file?: File;
      files?: File[];
    }
  }
}
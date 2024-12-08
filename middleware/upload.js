const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.baseUrl.includes('users')) {
      cb(null, 'public/uploads/users');
    } else if (req.baseUrl.includes('salons')) {
      cb(null, 'public/uploads/salons');
    } else {
      cb(new Error('Invalid upload destination'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

module.exports = upload;

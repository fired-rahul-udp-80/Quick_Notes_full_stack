const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with environment credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure Multer in-memory storage to handle direct file uploads
const storage = multer.memoryStorage();

// Allowed file types: PDF, DOC, DOCX, JPG, JPEG, PNG
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
  const ext = file.originalname.split('.').pop().toLowerCase();

  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Unsupported file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed.'),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit
  },
  fileFilter
});

/**
 * Uploads a file buffer directly to Cloudinary
 * @param {Buffer} fileBuffer - The in-memory buffer of the uploaded file
 * @param {Object} options - Cloudinary upload options (folder, resource_type, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'niu_notes/notes',
        resource_type: options.resource_type || 'auto',
        use_filename: true,
        unique_filename: true,
        ...options
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Extracts normalized file type from filename
 */
const getFileTypeFromFilename = (filename) => {
  if (!filename) return 'PDF';
  const ext = filename.split('.').pop().toUpperCase();
  if (['PDF', 'DOC', 'DOCX', 'JPG', 'JPEG', 'PNG'].includes(ext)) {
    return ext;
  }
  return 'PDF';
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  getFileTypeFromFilename
};

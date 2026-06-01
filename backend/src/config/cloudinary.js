const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'lms/others';
    let resource_type = 'auto';

    if (file.mimetype.startsWith('video')) {
      folder = 'lms/videos';
      resource_type = 'video';
    } else if (file.mimetype.startsWith('image')) {
      folder = 'lms/images';
      resource_type = 'image';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'lms/documents';
      resource_type = 'image'; // Cloudinary renders PDFs as images when resource_type is 'image'
    } else {
      folder = 'lms/documents';
      resource_type = 'raw';
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_')}`,
      format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
    };
  },
});

module.exports = { cloudinary, storage };

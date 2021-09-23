const multer = require("multer");
const { nanoid } = require("nanoid");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
};

const fileUpload = multer({
    limits: 1024 * 1024,

    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Invalid mime type"));
        }
        cb(undefined, true);
    }
});

module.exports = fileUpload;

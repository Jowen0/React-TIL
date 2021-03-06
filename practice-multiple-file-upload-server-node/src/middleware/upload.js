const util = require("util");
const multer = require("multer");
const maxSize = 4 * 1024 * 1024;

let storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, `${__basedir}/resources/static/assets/uploads/`)
    },
    filename: (req, file, cb) => {
        console.log(file.originalname); // 같은 이름의 파일인 경우 고려해야함
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
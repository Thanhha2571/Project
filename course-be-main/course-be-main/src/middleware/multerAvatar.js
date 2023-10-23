const multer = require('multer');
const fs = require('fs-extra');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = `./src/public/uploads/avatar/`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

var upload = multer({ storage: storage });
module.exports = upload;
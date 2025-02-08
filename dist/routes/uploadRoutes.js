"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middleware/upload"); // Use named import here
const router = (0, express_1.Router)();
router.post('/uploads', upload_1.upload.single('file'), (req, res) => {
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
exports.default = router;

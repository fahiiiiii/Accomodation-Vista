"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHotel = void 0;
const express_validator_1 = require("express-validator");
exports.validateHotel = [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.check)('description').notEmpty().withMessage('Description is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

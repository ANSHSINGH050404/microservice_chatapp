"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await Promise.resolve(handler(req, res, next));
        }
        catch (error) {
            res.status(500).json({
                message: error.message || "Internal Server Error",
            });
        }
    };
};
exports.default = TryCatch;

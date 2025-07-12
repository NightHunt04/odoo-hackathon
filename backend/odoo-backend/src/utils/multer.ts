import multer,{ FileFilterCallback } from 'multer'
import { Request } from 'express'

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './tmp/uploads')
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

function fileFilter (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/webp') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

export const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 1024 * 1024 * 5 } 
})
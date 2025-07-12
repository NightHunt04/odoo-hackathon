import { v2 as cloudinary } from 'cloudinary'
import { logger } from '../utils/logger'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadToCloudinary = async (file: string, folder: string, publicId?: string): Promise<{ url: string, publicId: string } | null> => {
    try {
        const result = await cloudinary.uploader.upload(file, { 
            resource_type: 'auto', 
            folder,
            public_id: publicId ? publicId : undefined
        })
        return { url: result.secure_url, publicId: result.public_id }
    } catch (error) {
        logger.error('Upload to Cloudinary error:', error)
        return null
    }
}

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
    try {
        await cloudinary.uploader.destroy(publicId)
        return true
    } catch (error) {
        logger.error('Delete from Cloudinary error:', error)
        return false
    }
}
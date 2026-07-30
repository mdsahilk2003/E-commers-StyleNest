import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ cloud_name: undefined, api_key: undefined, api_secret: undefined });

async function test() {
    try {
        await cloudinary.uploader.upload('data:image/png;base64,iVBOR', { folder: 'test' });
    } catch (error) {
        console.log('TYPE OF ERROR:', typeof error);
        console.log('ERROR:', error);
        console.log('ERROR.MESSAGE:', error.message);
    }
}
test();

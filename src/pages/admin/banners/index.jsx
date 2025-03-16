import React, { useState } from 'react';
import axios from 'axios';
import { UploadImage } from '../../../services/imageService';

const UploadImageTest = () => {
    const [imageUrl, setImageUrl] = useState('');

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('File', file);
        const res = await UploadImage(formData);
        if (res?.status === 200 && res?.data) {
            console.log(">>>check upload:", res);
            setImageUrl(res?.data?.imageUrl);
        }
        else {
            console.log("có lỗi xảy ra");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleUpload} />
            {imageUrl && (
                <div>
                    <h3>Ảnh vừa upload:</h3>
                    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            )}
        </div>
    );
};

export default UploadImageTest;

const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();

// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

class ImgUploader {
  async uploadImg(req, res) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Date.now() + '-' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'  
    };
 

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading:', err);
        return res.status(500).json({ error: 'Error uploading image' });
      }

      res.status(200).json({ url: data.Location });  
    });
  }
}

module.exports = new ImgUploader();

const express = require('express'),
  app = express(),
  router = express.Router();
let SoftwareInfo = require('../models/softwareInfo.model');
const multer = require('multer');
const AWS = require('aws-sdk');
const { feedbackMail } = require('../mails/feedbackMail');
const log = console.log;

AWS.config.update({ region: 'ap-south-1' });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/create').post((req, res) => {
  const newSoftwareInfo = new SoftwareInfo(req.body);

  newSoftwareInfo
    .save()
    .then((row) => {
      res.send(row);
      log('Form saved to mongo with the ID : ', row._id);
    })
    .catch((err) => {
      res.send(null);
      log('Error in saving the form to mongodb : ', err);
    });
});

// Get all software info data
router.route('/').get((req, res) => {
  SoftwareInfo.find()
    // .where('status')
    // .ne('deleted') // finds records which are not deleted
    .sort({
      createdAt: -1,
    })
    .then((softwareInfo) => res.json(softwareInfo))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get all software info data by id
router.route('/:id').get((req, res) => {
  SoftwareInfo.findById(req.params.id)
    .then((softwareInfo) => res.json(softwareInfo))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get record by id and renew it
router.route('/renew/:id').post((req, res) => {
  const payload = req.body;
  SoftwareInfo.findByIdAndUpdate(
    req.params.id,
    payload,
    {
      upsert: true,
      new: true,
    }
  )
    .then((SoftwareInfo) => { 
      return res.json(SoftwareInfo)
    
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get record by id and update it
router.route('/update/:id').post((req, res) => {
  const payload = req.body;
  SoftwareInfo.findByIdAndUpdate(req.params.id, payload, {
    upsert: true,
    new: true,
  })
    .then((row) => res.send(row))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get record by id and delete it
router.route('/:id').delete((req, res) => {
  SoftwareInfo.findByIdAndDelete(req.params.id)
    .then(() => res.json('success'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Upload multiple files to S3 bucket
router.route('/multiple/:id').post(upload.array('fileName', 10), (req, res) => {
  console.log('in route post');
  const files = req.files || [];
  SoftwareInfo.findById(req.params.id).then((item) => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
    const params = {
      Bucket: process.env.S3_BUCKET,
      CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: 'ap-south-1',
      },
    };

    const uploadedFiles = [];
    for (let file of files) {
      log('1 FileName : ', file.originalname);
      const fileNameArray = file.originalname.split('.');
      // Params for file Upload
      params.Body = file.buffer;
      params.Key = `${req.params.id}_${fileNameArray[0]}.${fileNameArray[1]}`;
      params.ContentType = file.mimetype;
      params.ContentDisposition = `attachment; filename=${file.originalname}`;
      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          res.status(400).json('File upload failed Error: ' + err);
          throw err;
        }
        console.log(`File uploaded successfully.`, data);
        uploadedFiles.push(`${data.Key}`);
        if (uploadedFiles.length === files.length) {
          const { billingDetails } = item;
          // Update the Db with the uploaded filenames
          item.billingDetails[billingDetails.length - 1].invoiceFiles =
            uploadedFiles;
          item
            .save()
            .then((data) => {
              res.send({
                status: 'File Upload Successful and saved to DB',
                data,
              });
            })
            .catch((err) => res.status(400).json('Error: ' + err));
        }
      });
    }
  });
});

// Get Signed URL for multiple files
router.route('/download/:id/:billingId').get((req, res) => {
  SoftwareInfo.findById(req.params.id).then((item) => {
    log('got item', req.params.billingId);
    try {
      const selectedBilling = item.billingDetails.filter(
        (item) => item._id == req.params.billingId
      );
      const fileNames = selectedBilling[0].invoiceFiles;
      log('selectedBilling fileNames', fileNames);
      const signedUrlExpireSeconds = 60 * 5;
      const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      });
      const params = {
        Bucket: process.env.S3_BUCKET,
        Expires: signedUrlExpireSeconds,
      };
      const signedUrls = [];
      fileNames?.forEach((url, index) => {
        log('getting file url:', url);
        params.Key = url;
        const signedUrl = s3.getSignedUrl('getObject', params);
        signedUrls.push(signedUrl);
      });
      res.send(signedUrls);
    } catch (e) {
      res.send(e);
    }
  });
});
router.route('/feebackMail').post((req, res) => {
  try {
    feedbackMail(req.body.feedbackText);
    res.status(200).send({
      message: "Success"
    });
    log('Sharing feedback mail !');
  } catch (err) {
    res.status(400).send('Error dp: ' + err);
  }
});

module.exports = router;

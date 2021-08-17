const router = require('express').Router();
let SoftwareInfo = require('../models/softwareInfo.model');
const { feedbackMail } = require('../mails/feedbackMail');
const log = console.log;

router.route('/create').post((req, res) => {
  const newSoftwareInfo = new SoftwareInfo(req.body);

  newSoftwareInfo
    .save()
    .then((row) => {
      res.json('success');
      log('Form saved to mongo with the ID : ', row._id);
    })
    .catch((err) => {
      res.json({
        status: 'fail',
      });
      log('Error in saving the form to mongodb : ', err);
    });
});

// Get all software info data
router.route('/').get((req, res) => {
  SoftwareInfo.find()
    .where('status')
    .ne('deleted') // finds records which are not deleted
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

// Get record by id and update it
router.route('/update/:id').post((req, res) => {
  const payload = req.body;
  SoftwareInfo.findByIdAndUpdate(req.params.id, payload, { upsert: true })
    .then(() => res.json('success'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get record by id and delete it
router.route('/:id').delete((req, res) => {
  SoftwareInfo.findByIdAndDelete(req.params.id)
    .then(() => res.json('success'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/feedbackMail').post((req, res) => {
  SoftwareInfo.findById(req.params.id)
  .then((softwareInfo) => {
      feedbackMail(softwareInfo);
      log('Sharing feedback mail !');
    })
    .catch((err) => res.status(400).json('Error dp: ' + err));
});

module.exports = router;

const router = require("express").Router();
let SoftwareInfo = require("../models/softwareInfo.model");
const log = console.log;


router.route("/create").post((req, res) => {
  const softwareName = req.body.softwareName;
  const teamName = req.body.teamName;
  const selectType = req.body.selectType;
  const owner = req.body.owner;
  const pricingInDollar = req.body.pricingInDollar;
  const pricingInRupee = req.body.pricingInRupee;
  const totalAmount = req.body.totalAmount;
  const timeline = req.body.timeline;
  const billingCycle = req.body.billingCycle;
  const nextBilling = Date.parse(req.body.nextBilling);
  const deleteReason = req.body.deleteReason
  // const restoreReason = "";
  // const reshareReason = "";

  const newSoftwareInfo = new SoftwareInfo({
    softwareName,
    teamName,
    selectType,
    owner,
    pricingInDollar,
    pricingInRupee,
    totalAmount,
    timeline,
    billingCycle,
    nextBilling,
    deleteReason,
    status
    // deleteReason,
    // restoreReason,
    // reshareReason,

  });

  newSoftwareInfo
    .save()
    .then((row) => {
      res.json("success");
      log("Form saved to mongo with the ID : ", row._id);
    })
    .catch((err) => {
      res.json({
        status: "fail",
      });
      log("Error in saving the form to mongodb : ", err)
    });

});

// Get all software info data
router.route("/").get((req, res) => {
  SoftwareInfo.find().sort({
    createdAt: -1,
  })
    .then((softwareInfo) => res.json(softwareInfo))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get all software info data by id
router.route("/:id").get((req, res) => {
  SoftwareInfo.findById(req.params.id)
    .then((softwareInfo) => res.json(softwareInfo))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get record by id and update it
router.route("/update/:id").post((req, res) => {
  const payload = req.body
  log('payload', payload)
  SoftwareInfo.findByIdAndUpdate(req.params.id, payload, { upsert: true })
    .then(() => res.json("Status is updated to Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});


// Get record by id and delete it
router.route("/:id").delete((req, res) => {
  SoftwareInfo.findByIdAndDelete(req.params.id)
    .then(() => res.json("SoftwareInfo deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});


module.exports = router;

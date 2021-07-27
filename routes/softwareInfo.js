const router = require("express").Router();
let SoftwareInfo = require("../models/softwareInfo.model");
const log = console.log;


router.route("/addNewSoftware").post((req, res) => {
  const softwareName = req.body.softwareName;
  const teamName = req.body.teamName;
  const type = req.body.type;
  const owner = req.body.owner;
  const pricingInDollar = req.body.pricingInDollar;
  const pricingInRupee =  req.body.pricingInRupee;
  const totalAmount =  req.body.totalAmount;
  const timeline = req.body.timeline;
  const billingCycle = req.body.billingCycle;
  // const nextBilling = Date.parse( req.body.nextBilling);

  // const deleteReason = "";
  // const restoreReason = "";
  // const reshareReason = "";

  const newSoftwareInfo = new SoftwareInfo({
    softwareName,
    teamName,
    type,
    owner,
    pricingInDollar,
    pricingInRupee,
    totalAmount,
    timeline,
    billingCycle
    // nextBilling,
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

router.route("/").get((req, res) => {
  SoftwareInfo.find().sort({
    createdAt: -1,
  })
    .then((softwareInfo) => res.json(softwareInfo))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  SoftwareInfo.findById(req.params.id)
    .then((softwareInfo) => res.json(softwareInfo))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  SoftwareInfo.findByIdAndDelete(req.params.id)
    .then(() => res.json("SoftwareInfo deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateStatus/:id").post((req, res) => {
  SoftwareInfo.findById(req.params.id)
    .then((softwareInfo) => {
      softwareInfo.deleteReason = req.body.deleteReason;
      softwareInfo.status = req.body.status;
      softwareInfo
        .save()
        .then(() => res.json("Status is updated to Deleted!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});



module.exports = router;

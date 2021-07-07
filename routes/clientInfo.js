const router = require("express").Router();
let ClientInfo = require("../models/clientInfo.model");
const log = console.log;


router.route("/addNewRecord").post((req, res) => {
  const projectNameByIT = req.body.projectNameByIT;
  const projectManager = req.body.projectManager;
  const email = req.body.email;
  const practice = req.body.practice;
  const status = req.body.status;
  const deleteReason = "";
  const restoreReason = "";
  const reshareReason = "";

  const newClientInfo = new ClientInfo({
    projectNameByIT,
    projectManager,
    email,
    practice,
    status,
    deleteReason,
    restoreReason,
    reshareReason,

  });

  newClientInfo
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
  ClientInfo.find().sort({
    createdAt: -1,
  })
    .then((clientInfo) => res.json(clientInfo))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  ClientInfo.findById(req.params.id)
    .then((clientInfo) => res.json(clientInfo))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  ClientInfo.findByIdAndDelete(req.params.id)
    .then(() => res.json("ClientInfo deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateStatus/:id").post((req, res) => {
  ClientInfo.findById(req.params.id)
    .then((clientInfo) => {
      clientInfo.deleteReason = req.body.deleteReason;
      clientInfo.status = req.body.status;
      clientInfo
        .save()
        .then(() => res.json("Status is updated to Deleted!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});



module.exports = router;

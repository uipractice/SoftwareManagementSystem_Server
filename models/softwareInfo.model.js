const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const softwareInfoSchema = new Schema(
    {
        softwareName: { type: String },
        teamName: { type: String },
        selectType: { type: String },
        owner: { type: String },
        pricingInDollar: { type: String },
        pricingInRupee: { type: String },
        totalAmount: { type: String },
        timeline: { type: String },
        billingCycle: { type: String},
        nextBilling: { type: Date},
        status: { type: String }
        // deleteReason: { type: String },
        // restoreReason: { type: String },
        // reshareReason: { type: String },
    }, 
    
    {  timestamps: true }
);

const SoftwareInfo = mongoose.model('SoftwareInfo', softwareInfoSchema);
module.exports = SoftwareInfo; 
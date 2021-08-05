const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const softwareInfoSchema = new Schema(
    {
        softwareName: { type: String },
        softwareType: { type: String },
        owner: { type: String },
        team: { type: String },
        totalAmount: { type: String },
        billingCycle: { type: String },
        nextBilling: { type: Date },
        billingDetails: [{
            pricingInDollar: { type: String },
            pricingInRupee: { type: String },
            billingMonth: { type: String },
            nextBilling: { type: Date },
            createdAt: { type: Date },
            timeline: { type: String },
        }],
        status: { type: String },
        deleteReason: { type: String },
        // restoreReason: { type: String },
        // reshareReason: { type: String },
    },

    { timestamps: true }
);

const SoftwareInfo = mongoose.model('SoftwareInfo', softwareInfoSchema);
module.exports = SoftwareInfo;
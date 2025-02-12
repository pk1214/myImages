const connection = require("../utilities/connection");
const mongoose = require("mongoose");

const commissionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artists",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number }, // Set by artist upon acceptance
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "declined by artist",
      "price proposed",
      "price accepted",
      "declined by user",
      "in progress",
      "completed",
      "delivered",
    ],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

let CommissionModel = {};

CommissionModel.getCommissionCollection = async () => {
  try {
    await connection.getUsersCollection(); // Ensure connection is established
    const model =
      mongoose.models.Commission ||
      mongoose.model("Commission", commissionSchema);
    return model;
  } catch (error) {
    throw new Error(
      "Could not connect to database for Commission: " + error.message
    );
  }
};

CommissionModel.createCommission = async (commissionData) => {
  const Commission = await CommissionModel.getCommissionCollection();
  const newCommission = await Commission.create(commissionData);
  return newCommission;
};

CommissionModel.getCommissionsByArtist = async (artistId) => {
  const Commission = await CommissionModel.getCommissionCollection();
  const commissions = await Commission.find({ artist: artistId }).populate(
    "user",
    "name email"
  );
  return commissions;
};

CommissionModel.getCommissionsByUser = async (userId) => {
  const Commission = await CommissionModel.getCommissionCollection();
  const commissions = await Commission.find({ user: userId }).populate(
    "artist",
    "name profile_picture"
  );
  return commissions;
};

CommissionModel.updateCommission = async (commissionId, updateData) => {
  const Commission = await CommissionModel.getCommissionCollection();
  const updatedCommission = await Commission.findByIdAndUpdate(
    commissionId,
    updateData,
    { new: true }
  );
  return updatedCommission;
};

module.exports = CommissionModel;

const CommissionDB = require("../model/CommissionDB");

const CommissionService = {};

// User submits a commission request
CommissionService.submitCommissionRequest = async (commissionData) => {
  try {
    const commission = await CommissionDB.createCommission(commissionData);
    return commission;
  } catch (error) {
    throw new Error("Commission submission failed: " + error.message);
  }
};

// Get commission requests for an artist
CommissionService.getCommissionRequestsForArtist = async (artistId) => {
  try {
    const commissions = await CommissionDB.getCommissionsByArtist(artistId);
    return commissions;
  } catch (error) {
    throw new Error("Failed to fetch commission requests: " + error.message);
  }
};

// Get commission requests for a user
CommissionService.getCommissionRequestsForUser = async (userId) => {
  try {
    const commissions = await CommissionDB.getCommissionsByUser(userId);
    return commissions;
  } catch (error) {
    throw new Error("Failed to fetch commission requests: " + error.message);
  }
};

// Update a commission request (status and/or price)
CommissionService.updateCommission = async (commissionId, updateData) => {
  try {
    const updatedCommission = await CommissionDB.updateCommission(
      commissionId,
      updateData
    );
    return updatedCommission;
  } catch (error) {
    throw new Error("Failed to update commission: " + error.message);
  }
};

module.exports = CommissionService;

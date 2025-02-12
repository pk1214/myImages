const bcrypt = require("bcryptjs");
const ArtistDB = require("../model/ArtistDB");

const artistService = {};

// Retrieve artist profile by ID
artistService.getArtistProfile = async (artistId) => {
  const artist = await ArtistDB.getArtistById(artistId);
  if (!artist) {
    throw new Error("Artist not found");
  }
  return artist;
};

// Update artist profile (including optional password change)
artistService.updateArtistProfile = async (artistId, updateData) => {
  // If password change fields are provided, validate them.
  if (
    updateData.old_password &&
    updateData.new_password &&
    updateData.confirm_password
  ) {
    const currentArtist = await ArtistDB.getArtistById(artistId);
    if (!currentArtist) {
      throw new Error("Artist not found");
    }
    // Compare old password (Note: for updating password, you need to get the current hashed password;
    // here we assume that for update operations you use a separate method or include the password field via another route.)
    // Since getArtistById uses .select('-password'), you might need a separate method to get the full document.
    // For demonstration, assume we have a full version:
    const artistModel =
      await require("../utilities/connection").getArtistsCollection();
    const fullArtist = await artistModel.findById(artistId);
    const isMatch = await bcrypt.compare(
      updateData.old_password,
      fullArtist.password
    );
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    if (updateData.new_password !== updateData.confirm_password) {
      throw new Error("New password and confirm password do not match");
    }
    // Hash the new password and add it to updateData
    const hashedPassword = await bcrypt.hash(updateData.new_password, 10);
    updateData.password = hashedPassword;
    // Remove temporary fields so they don't get saved in the document
    delete updateData.old_password;
    delete updateData.new_password;
    delete updateData.confirm_password;
  }

  const updatedArtist = await ArtistDB.updateArtistProfile(
    artistId,
    updateData
  );
  if (!updatedArtist) {
    throw new Error("Profile update failed");
  }
  return updatedArtist;
};

artistService.getAllArtists = async () => {
  try {
    const artists = await ArtistDB.getAllArtists();
    return artists;
  } catch (error) {
    throw new Error("Failed to fetch artists: " + error.message);
  }
};

module.exports = artistService;

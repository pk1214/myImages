const connection = require("../utilities/connection");

const artistDB = {};

artistDB.createArtist = async (artistData) => {
  const artistModel = await connection.getArtistsCollection();
  const newArtist = await artistModel.create(artistData);
  if (newArtist) {
    return newArtist;
  } else {
    return false;
  }
};

artistDB.findArtistByEmail = async (email) => {
  const artistModel = await connection.getArtistsCollection();
  const findArtist = await artistModel.findOne({ email });
  if (findArtist) {
    return findArtist;
  } else {
    return false;
  }
};

// Get artist by ID (excluding password)
artistDB.getArtistById = async (artistId) => {
  const artistModel = await connection.getArtistsCollection();
  const artist = await artistModel.findById(artistId);
  return artist || false;
};

// Update artist profile
artistDB.updateArtistProfile = async (artistId, updateData) => {
  const artistModel = await connection.getArtistsCollection();
  const updatedArtist = await artistModel.findByIdAndUpdate(
    artistId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  return updatedArtist || false;
};

artistDB.getAllArtists = async () => {
  try {
    let artistModel = await connection.getArtistsCollection();
    // Exclude sensitive fields like password
    const artists = await artistModel.find({}, { password: 0 });
    return artists;
  } catch (error) {
    throw new Error("Failed to fetch artists: " + error.message);
  }
};

module.exports = artistDB;

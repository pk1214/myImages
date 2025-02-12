// Commission.js
class Commission {
  constructor(obj) {
    this.user = obj.user;
    this.artist = obj.artist;
    this.title = obj.title;
    this.description = obj.description;
    this.price = obj.price;
    this.status = obj.status;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}

module.exports = Commission;

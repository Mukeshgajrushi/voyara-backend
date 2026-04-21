const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');
const packagesFile = path.join(__dirname, '../data/packages.json');
const bookingsFile = path.join(__dirname, '../data/bookings.json');

function readData(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.writeFileSync(file, '[]');
      return [];
    }
    console.error(`Error reading ${file}:`, error);
    return [];
  }
}

function writeData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${file}:`, error);
  }
}

module.exports = {
  getUsers: () => readData(usersFile),
  saveUsers: (data) => writeData(usersFile, data),
  
  getPackages: () => readData(packagesFile),
  savePackages: (data) => writeData(packagesFile, data),
  
  getBookings: () => readData(bookingsFile),
  saveBookings: (data) => writeData(bookingsFile, data)
};

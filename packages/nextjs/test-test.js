const crypto = require("crypto");
const CryptoJS = require("crypto-js");

const decryptData = (data, decrytKey) => {
  try {
    const _decryptedData = CryptoJS.AES.decrypt(data, decrytKey);
    const decryptedString = _decryptedData.toString(CryptoJS.enc.Utf8);
    return decryptedString;
  } catch (e) {
    console.log("ERR::decrypt-data", e);
  }
};

// const encryptData = (data, encryptionKey) => {
//   const _encryptedData = CryptoJS.AES.encrypt(data, encryptionKey);
//   const _encryptedDataString = _encryptedData.toString();
//   return _encryptedDataString;
// };
const userSecret = "0af1ee8d68b43fdc446f8be59b2c653080623cf410e94921ee6aaa90b08a27c8";
const envSecret = "c7ef32fed504513619f55ec6b07aaf56afd5928f34a38d70d7ff81583b8b1523";
// const secret = `${userSecret}:${envSecret}`;
console.log("API_KEY::", "64428ea40e3dfc4e08f1a652:884a04c62f31e3552db4d4422a1df0ff3322ea2d6666a6f94c31e0911d65be9f");

// const encApiKey = encryptData(
//   "64428ea40e3dfc4e08f1a652:884a04c62f31e3552db4d4422a1df0ff3322ea2d6666a6f94c31e0911d65be9f",
//   secret,
// );
// console.log("ENCRYPTED_KEY::", encApiKey);
// const decryptKey = decryptData(encApiKey, secret);
const decryptKey = decryptData(
  "U2FsdGVkX1/Y2SIkYQJLIsp0FiwWD6Ol+FDcAGAvdHRoVO1Pfln0eroIkV24iGwv",
  "a1d4ac058dbf5233c106c537fa9a483c8c018f9690f7b2af56dd57053a382e9b:c7ef32fed504513619f55ec6b07aaf56afd5928f34a38d70d7ff81583b8b1523",
);
const _userSecret = crypto.randomBytes(32).toString("hex");

console.log("DECRYPT_KEY::", decryptKey);
console.log("_userSecret", _userSecret);
const timestamp = 1687215000;
const date = new Date(timestamp * 1000);
const formattedDate = date.toISOString();
console.log("EXPIRY_formattedDate:", formattedDate);

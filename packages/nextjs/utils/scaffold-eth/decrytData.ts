import CryptoJS from "crypto-js";

export const decryptData = (data: string, decrytKey: string) => {
  try {
    console.log("_decrytKey", decrytKey);
    console.log("data:_decrytKey", data);
    const _decryptedData = CryptoJS.AES.decrypt(data, decrytKey);
    const decryptedString = _decryptedData.toString(CryptoJS.enc.Utf8);
    console.log("decrypt-string::", decryptedString);
    return decryptedString;
  } catch (e) {
    console.log("err::decrypt", e);
  }
};

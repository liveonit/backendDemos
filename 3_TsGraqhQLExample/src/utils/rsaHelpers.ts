import crypto from 'crypto';

export const rsaDecrypt = (encryptedData: Buffer, privateKey: string) => {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedData,
  );
  return decryptedData;
};

export const rsaEncrypt = (data: string, publicKey: string) => {
  const ecryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(data),
  );
  return ecryptedData;
};

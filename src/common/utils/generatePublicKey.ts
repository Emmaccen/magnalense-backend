import crypto from 'crypto';

const generatePublicKey = (): string => {
  const publicKeyLength = 32;  
  const publicKey: string = crypto.randomBytes(publicKeyLength).toString('hex');
  return publicKey;
};

export { generatePublicKey };
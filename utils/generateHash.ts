import crypto from 'crypto';

export default (size: number): string => {
  if (typeof size !== 'number') {
    return;
  }
  return crypto.randomBytes(size).toString('hex');
}

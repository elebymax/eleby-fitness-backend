import * as crypto from "crypto";
import config from '../config';

export default (password: string): string => {
  if (!password) {
    return '';
  }
  const result = crypto.createHash('md5');
  return result.update(`${config.app.passwordKey}${password}`).digest('hex');
};

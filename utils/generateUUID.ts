import uuidv4 from 'uuid/v4';
import uuidv5 from 'uuid/v5';
import config from '../config';

export default (str?: string): string => {
  if (str && config.app.uuidNamespace) {
    return uuidv5(str, config.app.uuidNamespace);
  }
  return uuidv4();
};

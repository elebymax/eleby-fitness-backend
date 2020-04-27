import axios from 'axios';
import config from '../../config';

export const getHealth = async () => {
  return axios.get(`http://localhost:${config.app.port}${config.app.baseApi}/health`);
};

import moment from 'moment';

export default (): string => {
  return moment.utc().format();
}

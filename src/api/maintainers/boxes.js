import axios from 'utils/axios';

export const getAllBoxes = async () => {
  const response = await axios.get('/maintainers/boxes/');
  return response.data;
};
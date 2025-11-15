import axios from 'utils/axios';

export const getSelectorBoxes = async () => {
  const response = await axios.get('/maintainers/boxes/', { params: { selector: true } });
  return response.data;
};
import axios from 'utils/axios';

export const getSelectorBoxes = async () => {
  const response = await axios.get('/maintainers/boxes/', { params: { selector: true } });
  return response.data;
};

export const getSelectorClients = async () => {
  const response = await axios.get('/maintainers/clients/', { params: { selector: true } });
  return response.data;
};

export const getSelectorRoles = async () => {
  const response = await axios.get('/maintainers/roles/', { params: { selector: true } });
  return response.data;
};
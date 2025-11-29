import axios from 'utils/axios';

export const getSelectorBoxes = async () => {
  const response = await axios.get('/boxes/selector');
  return response.data;
};

export const getSelectorClients = async () => {
  const response = await axios.get('/clients/selector');
  return response.data;
};

export const getSelectorRoles = async () => {
  const response = await axios.get('/roles/selector');
  return response.data;
};
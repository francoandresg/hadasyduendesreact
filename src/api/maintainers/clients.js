import axios from 'utils/axios';

export const getAllClients = async () => {
  const response = await axios.get('/maintainers/clients/');
  return response.data;
};

export const createClient = async (client) => {
  try {
    const response = await axios.post('/maintainers/clients/', client);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Error inesperado al crear el client.';
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateClient = async (client) => {
  try {
    const response = await axios.put('/maintainers/clients/', client);
    return response.data;
  } catch (error) {
    const errorMessage = error?.message || 'Error inesperado al actualizar el client.';
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const deleteClient = async (idClient) => {
  try {
    const response = await axios.post(
      `/maintainers/clients/`,
      { idClient },
      {
        params: {
          delete: true
        }
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error?.message || 'Error inesperado al eliminar el client.';
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateEstado = async (idClient, state) => {
  try {
    const response = await axios.put(
      '/maintainers/clients/',
      { idClient, state },
      {
        params: {
          state: true
        }
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Error inesperado al actualizar el estado del client.';
    return {
      success: false,
      message: errorMessage
    };
  }
};

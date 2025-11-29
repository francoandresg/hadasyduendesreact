import axios from 'utils/axios';

export const getAllBoxes = async () => {
  const response = await axios.get('/boxes');
  return response.data;
};

export const createBox = async (box) => {
  try {
    const response = await axios.post('/maintainers/boxes/', box);
    return response.data; // { success: true, newRow: {...} }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al crear el box.';

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateBox = async (box) => {
  try {
    const response = await axios.put('/maintainers/boxes/', box);
    return response.data; // { success: true, updatedRow: {...} }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al actualizar el box.';

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const deleteBox = async (idBox) => {
  try {
    const response = await axios.delete(`/maintainers/boxes`, {
      params: { idBox }
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al eliminar el box.';

    return {
      success: false,
      message: error?.message || 'Error inesperado al eliminar el box.'
    };
  }
};

export const updateEstado = async (idBox, state) => {
  try {
    const response = await axios.put(
      '/maintainers/boxes/',
      { idBox, state },
      {
        params: {
          state: true
        }
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Error inesperado al actualizar el estado del box.';
    return {
      success: false,
      message: errorMessage
    };
  }
};

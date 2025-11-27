import axios from 'utils/axios';

export const getAllBoxes = async () => {
  try {
    const response = await axios.get('/maintainers/boxes/');
    return response.data; // { success: true, data: [...] }
  } catch (error) {
    return {
      success: false,
      message: error?.message || 'Error inesperado al obtener los boxes.'
    };
  }
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
    const response = await axios.delete('/maintainers/boxes/', {
      data: { idBox } // <= importante
    });
    return response.data; // { success: true }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al eliminar el box.';

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateState = async (idBox, state) => {
  try {
    const response = await axios.post('/maintainers/boxes/state', { idBox, state });
    return response.data; // { success: true }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al actualizar el estado del box.';

    return {
      success: false,
      message: errorMessage
    };
  }
};
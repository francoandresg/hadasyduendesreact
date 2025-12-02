import axios from 'utils/axios';

export const getAllProfessionals = async () => {
  const response = await axios.get('/professionals');
  return response.data;
};

export const createProfessional = async (professional) => {
  try {
    const response = await axios.post('/professionals', professional);
    return response.data; // { success: true, newRow: {...} }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al crear el profesional.';

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateProfessional = async (professional) => {
  try {
    const response = await axios.put(`/professionals/${professional.idProfessional}`, professional);
    return response.data; // { success: true, updatedRow: {...} }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al actualizar el profesional.';

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateEstado = async (idProfessional, state) => {
  try {
    const response = await axios.put(`/professionals/${idProfessional}/state`, { state });

    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Error inesperado al actualizar el estado del box.';
    return {
      success: false,
      message: errorMessage
    };
  }
};


export const deleteProfessional = async (idProfessional) => {
  try {
    const response = await axios.delete(`/professionals/${idProfessional}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al eliminar el profesional.';

    return {
      success: false,
      message: error?.message || 'Error inesperado al eliminar el profesional.'
    };
  }
};
import axios from 'utils/axios';

export const getAllServicesType = async () => {
  const response = await axios.get('/services-type');
  return response.data;
};

export const getServicesTypeSelector = async () => {
  const response = await axios.get('/services-type/selector');
  return response.data;
};

export const createServiceType = async (serviceType) => {
  try {
    const response = await axios.post('/services-type', serviceType);
    return response.data; // { success: true, newRow: {...} }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data?.message || error.message || 'Error inesperado al crear el tipo de servicio.';

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateServiceType = async (serviceType) => {
  try {
    const response = await axios.put(`/services-type/${serviceType.idServiceType}`, serviceType);
    return response.data; // { success: true, updatedRow: {...} }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data?.message || error.message || 'Error inesperado al actualizar el tipo de servicio.';
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateEstado = async (idServiceType, state) => {
  try {
    const response = await axios.put(`/services-type/${idServiceType}/state`, { state });

    return response.data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Error inesperado al actualizar el estado del tipo de servicio.';
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const deleteServiceType = async (idServiceType) => {
  try {
    const response = await axios.delete(`/services-type/${idServiceType}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data?.message || error.message || 'Error inesperado al eliminar el tipo de servicio.';
    return {
      success: false,
      message: error?.message || 'Error inesperado al eliminar el tipo de servicio.'
    };
  }
};
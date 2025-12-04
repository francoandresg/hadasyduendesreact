import { useEffect, useState, useMemo } from 'react';
import ReactTable from '../../components/tabla/pagination/ReactTable';
import ModalAdd from '../../components/modal/ModalAdd';
import ModalEdit from '../../components/modal/ModalEdit';
import ModalDelete from '../../components/modal/ModalDelete';
import ModalState from '../../components/modal/ModalState';

import { Switch } from '@mui/material';

import { getAllServicesType, createServiceType, updateServiceType, deleteServiceType, updateEstado } from '../../api/maintainers/servicesType';

import { openSnackbar } from 'utils/snackbar';

export default function WidgetServicesType() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(true);

  const [servicesType, setServicesType] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  // Modals
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  // Selections
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [serviceTypeToDelete, setServiceTypeToDelete] = useState(null);

  // State switch modal
  const [serviceTypeStateObj, setServiceTypeStateObj] = useState(null);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [newState, setNewState] = useState(null);

  // Window resize
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getAllServicesType();
        if (!isMounted) return;

        setServicesType(data.data);

        setColumnDefs([
          {
            header: 'ID',
            accessorKey: 'idServiceType',
            type: 'number',
            visible: 0,
            visibleColumn: 1,
            id: true,
            required: 0
          },
          {
            header: 'NOMBRE',
            label: 'Nombre',
            accessorKey: 'serviceType',
            type: 'text',
            visible: 1,
            visibleColumn: 1,
            required: 1,
            id: false,
            size: { xs: 12, md: 12 }
          },
          {
            header: 'ESTADO',
            accessorKey: 'state',
            type: 'switch',
            visible: 0,
            visibleColumn: 1,
            required: 0,
            id: false
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching servicios tipo:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => (isMounted = false);
  }, []);

  // Prepare columns for ReactTable
  const columns = useMemo(() => {
    return columnDefs.map((col) => {
      const baseColumn = {
        header: col.header,
        accessorKey: col.accessorKey,
        type: col.type,
        required: col.required || 0,
        actions: col.actions || 0,
        enableHiding: true,
        visible: col.visible === 1
      };

      if (col.type === 'select') baseColumn.options = col.options;

      // Switch rendering
      if (col.type === 'switch') {
        baseColumn.cell = ({ row }) => {
          const serviceTypeObj = row.original;
          const stateBool = serviceTypeObj.state === 1;

          const handleChange = (e) => {
            const newValue = e.target.checked ? 1 : 0;
            setServiceTypeStateObj(serviceTypeObj);
            setNewState(newValue);
            setOpenStateModal(true);
          };

          return <Switch checked={stateBool} onChange={handleChange} color="primary" size="small" />;
        };
      }

      return baseColumn;
    });
  }, [columnDefs]);

  // ------- ADD -------
  const handleAdd = () => setOpenModalAdd(true);
  const handleCloseModalAdd = () => setOpenModalAdd(false);

  const handleAddSave = async (newData) => {
    const response = await createServiceType(newData);

    if (response.success) {
      setServicesType((prev) => [response.newRow, ...prev]);
      setOpenModalAdd(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
      });
    }
  };

  // ------- EDIT -------
  const handleEdit = (serviceType) => {
    setSelectedServiceType(serviceType);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setSelectedServiceType(null);
  };

  const handleEditSave = async (editedData) => {
    const response = await updateServiceType(editedData);

    if (response.success) {
      setServicesType((prev) => prev.map((b) => (b.idServiceType === response.updatedRow.idServiceType ? response.updatedRow : b)));

      setOpenModalEdit(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
      });
    }
  };

  // ------- DELETE -------
  const handleDelete = (serviceType) => {
    setServiceTypeToDelete(serviceType);
    setOpenModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteServiceType(serviceTypeToDelete.idServiceType);

    if (response.success) {
      setServicesType((prev) => prev.filter((b) => b.idServiceType !== serviceTypeToDelete.idServiceType));

      setOpenModalDelete(false);
      setServiceTypeToDelete(null);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
      });
    }
  };

  // ------- CHANGE STATE -------
  const handleCloseStateModal = () => {
    setOpenStateModal(false);
    setTimeout(() => {
      setServiceTypeStateObj(null);
      setNewState(null);
    }, 300);
  };

  const handleConfirmState = async () => {
    if (!serviceTypeStateObj) return;

    try {
      const response = await updateEstado(serviceTypeStateObj.idServiceType, newState);

      if (response.success) {
        setServicesType((prev) => prev.map((b) => (b.idServiceType === serviceTypeStateObj.idServiceType ? { ...b, state: newState } : b)));
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'success', variant: 'outlined' },
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          close: true
        });
      } else {
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'error', variant: 'outlined' },
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          close: true
        });
      }
    } catch (error) {
      console.error('Error updating state:', error);
    } finally {
      handleCloseStateModal();
    }
  };

  return (
    <>
      <ReactTable
        columns={columns}
        data={servicesType}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        height={windowHeight - 349}
        loading={loading}
      />

      <ModalAdd
        open={openModalAdd}
        onClose={handleCloseModalAdd}
        onSave={handleAddSave}
        columns={columnDefs}
        modalGrid="xs"
        entity="tipo de servicio"
        entityConfirm="el tipo de servicio"
      />

      <ModalEdit
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        data={selectedServiceType}
        onSave={handleEditSave}
        columns={columnDefs}
        modalGrid="xs"
        entity="tipo de servicio"
        entityConfirm="el tipo de servicio"
      />

      <ModalDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        fila={serviceTypeToDelete?.serviceType}
        entity="el tipo de servicio"
      />

      <ModalState
        open={openStateModal}
        onClose={handleCloseStateModal}
        onConfirm={handleConfirmState}
        fila={serviceTypeStateObj?.serviceType}
        entity="el tipo de servicio"
        state={serviceTypeStateObj?.state}
        newState={newState}
      />
    </>
  );
}

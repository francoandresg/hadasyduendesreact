import { useEffect, useState, useMemo } from 'react';
import ReactTable from '../../components/tabla/pagination/ReactTable';
import ModalAdd from '../../components/modal/ModalAdd';
import ModalEdit from '../../components/modal/ModalEdit';
import ModalDelete from '../../components/modal/ModalDelete';
import ModalState from '../../components/modal/ModalState';

import { Switch } from '@mui/material';

import { getAllProfessionals, createProfessional, updateProfessional, deleteProfessional, updateEstado } from '../../api/maintainers/professionals';

import { getServicesTypeSelector } from '../../api/maintainers/servicesType';

import { openSnackbar } from 'utils/snackbar';

export default function WidgetProfessionals() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(true);

  const [professionals, setProfessionals] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  // Modals
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  // Selections
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [professionalToDelete, setProfessionalToDelete] = useState(null);

  // State switch modal
  const [professionalStateObj, setProfessionalStateObj] = useState(null);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [newState, setNewState] = useState(null);

  // Selecter ServicesType
  const [servicesType, setServicesType] = useState([]);

  // Window resize
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getServicesTypeSelector().then((res) => {
      if (res.success) {
        setServicesType(res.data);
      }
    });
  }, []);

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getAllProfessionals();
        if (!isMounted) return;

        setProfessionals(data.data);

        setColumnDefs([
          {
            header: 'ID',
            accessorKey: 'idProfessional',
            type: 'number',
            visible: 0,
            visibleColumn: 1,
            id: true,
            required: 0,
          },
          {
            header: 'PROFESIONAL',
            label: 'Profesional',
            accessorKey: 'professional',
            type: 'text',
            visible: 1,
            visibleColumn: 1,
            required: 1,
            id:false,
            size: { xs: 12, md: 12 }
          },
          {
            header: 'CORREO',
            label: 'Correo',
            accessorKey: 'email',
            type: 'text',
            visible: 1,
            visibleColumn: 1,
            required: 1,
            id:false,
            size: { xs: 12, md: 12 }
          },
          {
            header: 'CUMPLEAÑOS',
            label: 'Cumpleaños',
            accessorKey: 'birthday',
            type: 'date',
            visible: 1,
            visibleColumn: 1,
            required: 1,
            id: false,
            size: { xs: 12, md: 12 }
          },
          {
            header: 'TIPO DE SERVICIO',
            label: 'Tipo de servicio',
            valueType: 'id',
            accessorKey: 'idServiceType',
            type: 'select',
            options: servicesType,
            visible: 1,
            visibleColumn: 0,
            required: 1,
            id: false,
            size: { xs: 12, md: 12 }
          },
          {
            header: 'TIPO DE SERVICIO',
            label: 'Tipo de servicio',
            accessorKey: 'serviceType',
            type: 'text',
            visible: 0,
            visibleColumn: 1,
            required: 0,
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
        console.error('Error fetching professionals:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => (isMounted = false);
  }, [servicesType]);

  // Prepare columns for ReactTable
  const columns = useMemo(() => {
    return columnDefs.filter(col => col.visibleColumn !== 0).map((col) => {
      const baseColumn = {
        header: col.header,
        accessorKey: col.accessorKey,
        type: col.type,
        required: col.required || 0,
        actions: col.actions || 0,
        enableHiding: true,
        visible: col.visible === 1,
        visibleColumn: col.visibleColumn === 1
      };

      if (col.type === 'select') baseColumn.options = col.options;

      // Switch rendering
      if (col.type === 'switch') {
        baseColumn.cell = ({ row }) => {
          const professionalObj = row.original;
          const stateBool = professionalObj.state === 1;

          const handleChange = (e) => {
            const newValue = e.target.checked ? 1 : 0;
            setProfessionalStateObj(professionalObj);
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
    const response = await createProfessional(newData);

    if (response.success) {
      setProfessionals((prev) => [response.newRow, ...prev]);
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
  const handleEdit = (professional) => {
    setSelectedProfessional(professional);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setSelectedProfessional(null);
  };

  const handleEditSave = async (editedData) => {
    const response = await updateProfessional(editedData);

    if (response.success) {
      setProfessionals((prev) => prev.map((p) => (p.idProfessional === response.updatedRow.idProfessional ? response.updatedRow : p)));

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
  const handleDelete = (professional) => {
    setProfessionalToDelete(professional);
    setOpenModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteProfessional(professionalToDelete.idProfessional);

    if (response.success) {
      setProfessionals((prev) => prev.filter((p) => p.idProfessional !== professionalToDelete.idProfessional));

      setOpenModalDelete(false);
      setProfessionalToDelete(null);
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
      setProfessionalStateObj(null);
      setNewState(null);
    }, 300);
  };

  const handleConfirmState = async () => {
    if (!professionalStateObj) return;

    try {
      const response = await updateEstado(professionalStateObj.idProfessional, newState);

      if (response.success) {
        setProfessionals((prev) => prev.map((p) => (p.idProfessional === professionalStateObj.idProfessional ? { ...p, state: newState } : p)));
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
        data={professionals}
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
        entity="professional"
        entityConfirm="el profesional"
      />

      <ModalEdit
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        data={selectedProfessional}
        onSave={handleEditSave}
        columns={columnDefs}
        modalGrid="xs"
        entity="professional"
        entityConfirm="el profesional"
      />

      <ModalDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        fila={professionalToDelete?.professional}
        entity="el profesional"
      />

      <ModalState
        open={openStateModal}
        onClose={handleCloseStateModal}
        onConfirm={handleConfirmState}
        fila={professionalStateObj?.professional}
        entity="el profesional"
        state={professionalStateObj?.state}
        newState={newState}
      />
    </>
  );
}
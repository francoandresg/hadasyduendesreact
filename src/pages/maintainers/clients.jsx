import { useEffect, useState, useMemo } from 'react'; 
import ReactTable from '../../components/tabla/pagination/ReactTable';
import ModalAdd from '../../components/modal/ModalAdd';
import ModalEdit from '../../components/modal/ModalEdit';
import ModalDelete from '../../components/modal/ModalDelete';
import ModalState from '../../components/modal/ModalState';

import { Switch } from '@mui/material';

import { getAllClients, createClient, updateClient, deleteClient, updateEstado } from '../../api/maintainers/clients';

import { openSnackbar } from 'utils/snackbar';

export default function WidgetClients() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(true);

  const [clients, setClients] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  // Modals
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  // Selections
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

  // State switch modal
  const [clientStateObj, setClientStateObj] = useState(null);
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
        const data = await getAllClients();
        if (!isMounted) return;

        setClients(data.data);

        setColumnDefs([
          {
            header: 'ID',
            accessorKey: 'idClient',
            type: 'number',
            visible: 0,
            id: true,
          },
          {
            header: 'NOMBRE',
            label: 'Nombre',
            accessorKey: 'clientname',
            type: 'text',
            visible: 1,
            required: 1,
            id:false,
            size: { xs: 12, md: 6 }
          },
          {
            header: 'CORREO',
            label: 'Correo',
            accessorKey: 'email',
            type: 'text',
            visible: 1,
            required: 0,
            id:false,
            size: { xs: 12, md: 6 }
          },
          {
            header: 'TELÉFONO',
            label: 'Teléfono',
            accessorKey: 'phone',
            type: 'text',
            visible: 1,
            required: 0,
            id:false,
            size: { xs: 12, md: 6 }
          },
          {
            header: 'CUMPLEAÑOS',
            label: 'Cumpleaños',
            accessorKey: 'birthday',
            type: 'date',
            visible: 1,
            required: 0,
            id:false,
            size: { xs: 12, md: 6 }
          },
          {
            header: 'ESTADO',
            accessorKey: 'state',
            type: 'switch',
            visible: 0,
            required: 0,
            id: false
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
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
          const clientObj = row.original;
          const stateBool = clientObj.state === 1;

          const handleChange = (e) => {
            const newValue = e.target.checked ? 1 : 0;
            setClientStateObj(clientObj);
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
    const response = await createClient(newData);

    if (response.success) {
      setClients((prev) => [response.newRow, ...prev]);
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
  const handleEdit = (client) => {
    setSelectedClient(client);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setSelectedClient(null);
  };

  const handleEditSave = async (editedData) => {
    const response = await updateClient(editedData);

    if (response.success) {
      setClients((prev) => prev.map((c) => (c.idClient === response.updatedRow.idClient ? response.updatedRow : c)));

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
  const handleDelete = (client) => {
    setClientToDelete(client);
    setOpenModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteClient(clientToDelete.idClient);

    if (response.success) {
      setClients((prev) => prev.filter((c) => c.idClient !== clientToDelete.idClient));

      setOpenModalDelete(false);
      setClientToDelete(null);
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
      setClientStateObj(null);
      setNewState(null);
    }, 300);
  };

  const handleConfirmState = async () => {
    if (!clientStateObj) return;

    try {
      const response = await updateEstado(clientStateObj.idClient, newState);

      if (response.success) {
        setClients((prev) => prev.map((c) => (c.idClient === clientStateObj.idClient ? { ...c, state: newState } : c)));
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
        data={clients}
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
        modalGrid="sm"
        entity="cliente"
        entityConfirm="el cliente"
      />

      <ModalEdit
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        data={selectedClient}
        onSave={handleEditSave}
        columns={columnDefs}
        modalGrid="sm"
        entity="cliente"
        entityConfirm="el cliente"
      />

      <ModalDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        fila={clientToDelete?.client}
        entity="el cliente"
      />

      <ModalState
        open={openStateModal}
        onClose={handleCloseStateModal}
        onConfirm={handleConfirmState}
        fila={clientStateObj?.client}
        entity="el cliente"
        state={clientStateObj?.state}
        newState={newState}
      />
    </>
  );
}

import { useEffect, useState, useMemo } from 'react';
import ReactTable from '../../components/tabla/pagination/ReactTable';
import ModalAdd from '../../components/modal/ModalAdd';
import ModalEdit from '../../components/modal/ModalEdit';
import ModalDelete from '../../components/modal/ModalDelete';
import ModalState from '../../components/modal/ModalState';

import { Switch } from '@mui/material';

import { getAllBoxes, createBox, updateBox, deleteBox, updateEstado } from '../../api/maintainers/boxes';

import { openSnackbar } from 'utils/snackbar';

export default function WidgetBoxes() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(true);

  const [boxes, setBoxes] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  // Modals
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  // Selections
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxToDelete, setBoxToDelete] = useState(null);

  // State switch modal
  const [boxStateObj, setBoxStateObj] = useState(null);
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
        const data = await getAllBoxes();
        if (!isMounted) return;

        setBoxes(data.data);

        setColumnDefs([
          {
            header: 'ID',
            accessorKey: 'idBox',
            type: 'number',
            visible: 0,
            id: true,
            required: 0,
          },
          {
            header: 'NOMBRE',
            label: 'Nombre',
            accessorKey: 'box',
            type: 'text',
            visible: 1,
            required: 1,
            id:false,
            size: { xs: 12, md: 12 }
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
        console.error('Error fetching boxes:', error);
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
          const boxObj = row.original;
          const stateBool = boxObj.state === 1;

          const handleChange = (e) => {
            const newValue = e.target.checked ? 1 : 0;
            setBoxStateObj(boxObj);
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
    const response = await createBox(newData);

    if (response.success) {
      setBoxes((prev) => [response.newRow, ...prev]);
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
  const handleEdit = (box) => {
    setSelectedBox(box);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setSelectedBox(null);
  };

  const handleEditSave = async (editedData) => {
    const response = await updateBox(editedData);

    if (response.success) {
      setBoxes((prev) => prev.map((b) => (b.idBox === response.updatedRow.idBox ? response.updatedRow : b)));

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
  const handleDelete = (box) => {
    setBoxToDelete(box);
    setOpenModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteBox(boxToDelete.idBox);

    if (response.success) {
      setBoxes((prev) => prev.filter((b) => b.idBox !== boxToDelete.idBox));

      setOpenModalDelete(false);
      setBoxToDelete(null);
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
      setBoxStateObj(null);
      setNewState(null);
    }, 300);
  };

  const handleConfirmState = async () => {
    if (!boxStateObj) return;

    try {
      const response = await updateEstado(boxStateObj.idBox, newState);

      if (response.success) {
        setBoxes((prev) => prev.map((b) => (b.idBox === boxStateObj.idBox ? { ...b, state: newState } : b)));
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
        data={boxes}
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
        entity="box"
        entityConfirm="el box"
      />

      <ModalEdit
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        data={selectedBox}
        onSave={handleEditSave}
        columns={columnDefs}
        modalGrid="xs"
        entity="box"
        entityConfirm="el box"
      />

      <ModalDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        fila={boxToDelete?.box}
        entity="el box"
      />

      <ModalState
        open={openStateModal}
        onClose={handleCloseStateModal}
        onConfirm={handleConfirmState}
        fila={boxStateObj?.box}
        entity="el box"
        state={boxStateObj?.state}
        newState={newState}
      />
    </>
  );
}

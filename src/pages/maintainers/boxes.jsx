import { useEffect, useState, useMemo } from 'react';
import ReactTable from '../../components/tabla/pagination/ReactTable';
<<<<<<< HEAD
import ModalAgregar from 'components/modal/ModalAgregar';
import ModalEditar from 'components/modal/ModalEditar';
import ModalEliminar from 'components/modal/ModalEliminar';
import ModalState from 'components/modal/ModalState';
import { getAllBoxes, createBox, updateBox, deleteBox, updateState } from '../../api/maintainers/boxes';
import { openSnackbar } from 'utils/snackbar';
=======
import ModalAdd from '../../components/modal/ModalAdd';
import ModalEdit from '../../components/modal/ModalEdit';
import ModalDelete from '../../components/modal/ModalDelete';
import ModalState from '../../components/modal/ModalState';

>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
import { Switch } from '@mui/material';

import { getAllBoxes, createBox, updateBox, deleteBox, updateEstado } from '../../api/maintainers/boxes';

import { openSnackbar } from 'utils/snackbar';

export default function WidgetBoxes() {
  // Control de altura
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Estado general
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [boxes, setBoxes] = useState([]);
  const [permisos, setPermisos] = useState([]);

  // Estados modales
  const [openModalAdd, setOpenModalAdd] = useState(false); 
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModalState, setOpenModalState] = useState(false);

  // Selecciones
  const [boxSeleccionado, setBoxSeleccionado] = useState(null);
  const [boxAEliminar, setBoxAEliminar] = useState(null);
  const [boxState, setBoxState] = useState(null);
  const [newState, setNewState] = useState(null);

  // Definición de columnas 
  const columnas = [
    {
      header: 'ID',
      accessorKey: 'id_box',
      type: 'int',
      visible: true,
      enableHiding: false,
    },
    {
      header: 'Box',
      accessorKey: 'box',
      type: 'string',
      required: 1,
      visible: true,
    },
    {
      header: 'Estado',
      accessorKey: 'state',
      type: 'boolean',
      visible: true,
    },
  ];

  // Ajustar altura en tiempo real
=======

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
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

<<<<<<< HEAD
  // Cargar data inicial
=======
  // Fetch data
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        setLoading(true);
        const data = await getAllBoxes();
        setBoxes(data.data || []);
        setPermisos([]); // Tu backend no devuelve permisos
      } catch (error) {
        console.error('Error al obtener boxes:', error);
      } finally {
        setLoading(false);
=======
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
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      }
    };
    fetchData();
<<<<<<< HEAD
  }, []);

  // Columnas con comportamiento dinámico (switch para state)
  const columns = useMemo(() => {
    return columnas.map((col) => {
      const baseColumn = { ...col };

      if (col.accessorKey === 'state') {
        baseColumn.cell = (row) => {
          const state = row.row.original.state === 1;
          const handleChange = () => {
            setBoxState(row.row.original);
            setNewState(state ? 0 : 1);
            setOpenModalState(true);
          };
          return (
            <Switch
              checked={state}
              onChange={handleChange}
              color="primary"
              size="small"
            />
          );
=======
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
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
        };
      }

      return baseColumn;
    });
<<<<<<< HEAD
  }, []);

  // Agregar
  const handleGuardarCambios = async (datosNuevos) => {
    const response = await createBox(datosNuevos);
    if (response.success) {
      setBoxes((prev) => [response.box, ...prev]);
=======
  }, [columnDefs]);

  // ------- ADD -------
  const handleAdd = () => setOpenModalAdd(true);
  const handleCloseModalAdd = () => setOpenModalAdd(false);

  const handleAddSave = async (newData) => {
    const response = await createBox(newData);

    if (response.success) {
      setBoxes((prev) => [response.newRow, ...prev]);
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      setOpenModalAdd(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
<<<<<<< HEAD
=======
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
<<<<<<< HEAD
=======
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      });
    }
  };

<<<<<<< HEAD
  // Editar
  const handleEditarCambios = async (datosEditados) => {
    const response = await updateBox(datosEditados);
    if (response.success) {
      setBoxes((prev) =>
        prev.map((b) => (b.idBox === response.box.idBox ? response.box : b))
      );
=======
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

>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      setOpenModalEdit(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
<<<<<<< HEAD
=======
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
<<<<<<< HEAD
=======
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      });
    }
  };

<<<<<<< HEAD
  // Eliminar
  const confirmarEliminacion = async () => {
    const response = await deleteBox(boxAEliminar.idBox);
    if (response.success) {
      setBoxes((prev) => prev.filter((b) => b.idBox !== boxAEliminar.idBox));
      setOpenDialog(false);
=======
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
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
<<<<<<< HEAD
=======
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
<<<<<<< HEAD
=======
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        close: true
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
      });
    }
  };

<<<<<<< HEAD
  // Estado (switch)
  const handleConfirmState = async () => {
    try {
      const response = await updateState(boxState.idBox, newState);
      if (response.success) {
        setBoxes((prev) =>
          prev.map((b) =>
            b.idBox === boxState.idBox ? { ...b, state: newState } : b
          )
        );
=======
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
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'success', variant: 'outlined' },
<<<<<<< HEAD
=======
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          close: true
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
        });
      } else {
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'error', variant: 'outlined' },
<<<<<<< HEAD
        });
      }
    } catch (error) {
      console.error('Error al actualizar state:', error);
    } finally {
      setOpenModalState(false);
      setBoxState(null);
      setNewState(null);
=======
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          close: true
        });
      }
    } catch (error) {
      console.error('Error updating state:', error);
    } finally {
      handleCloseStateModal();
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
    }
  };

  // Render
  return (
    <>
      <ReactTable
        columns={columns}
        data={boxes}
<<<<<<< HEAD
        onAdd={permisos[0]?.crear === 1 ? () => setOpenModalAdd(true) : undefined}
        onEdit={permisos[0]?.editar === 1 ? (row) => { setBoxSeleccionado(row); setOpenModalEdit(true); } : undefined}
        onDelete={permisos[0]?.eliminar === 1 ? (row) => { setBoxAEliminar(row); setOpenDialog(true); } : undefined}
=======
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
        height={windowHeight - 349}
        loading={loading}
      />

<<<<<<< HEAD
      <ModalAgregar
        open={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        onSave={handleGuardarCambios}
        columns={columns}
=======
      <ModalAdd
        open={openModalAdd}
        onClose={handleCloseModalAdd}
        onSave={handleAddSave}
        columns={columnDefs}
        modalGrid="xs"
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
        entity="box"
        entityConfirm="el box"
      />

<<<<<<< HEAD
      <ModalEditar
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        data={boxSeleccionado}
        onSave={handleEditarCambios}
        columns={columns}
        entity="box"
        entityConfirm="el box"
      /> 

      <ModalEliminar
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmarEliminacion}
        fila={boxAEliminar?.box}
=======
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
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
        entity="el box"
      />

      <ModalState
<<<<<<< HEAD
        open={openModalState}
        onClose={() => setOpenModalState(false)}
        onConfirm={handleConfirmState}
        fila={boxState?.box}
        entity="el box"
        state={boxState?.state}
=======
        open={openStateModal}
        onClose={handleCloseStateModal}
        onConfirm={handleConfirmState}
        fila={boxStateObj?.box}
        entity="el box"
        state={boxStateObj?.state}
>>>>>>> b94638960b4761d1a5749c14901ddc11ce698362
        newState={newState}
      />
    </>
  );
}

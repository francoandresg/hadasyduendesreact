import { useEffect, useState, useMemo } from 'react';
import ReactTable from '../../components/tabla/pagination/ReactTable';
import ModalAgregar from 'components/modal/ModalAgregar';
import ModalEditar from 'components/modal/ModalEditar';
import ModalEliminar from 'components/modal/ModalEliminar';
import ModalState from 'components/modal/ModalState';
import { getAllBoxes, createBox, updateBox, deleteBox, updateState } from '../../api/maintainers/boxes';
import { openSnackbar } from 'utils/snackbar';
import { Switch } from '@mui/material';

export default function WidgetBoxes() {
  // Control de altura
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Estado general
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar data inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllBoxes();
        setBoxes(data.data || []);
        setPermisos([]); // Tu backend no devuelve permisos
      } catch (error) {
        console.error('Error al obtener boxes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        };
      }

      return baseColumn;
    });
  }, []);

  // Agregar
  const handleGuardarCambios = async (datosNuevos) => {
    const response = await createBox(datosNuevos);
    if (response.success) {
      setBoxes((prev) => [response.box, ...prev]);
      setOpenModalAdd(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
      });
    }
  };

  // Editar
  const handleEditarCambios = async (datosEditados) => {
    const response = await updateBox(datosEditados);
    if (response.success) {
      setBoxes((prev) =>
        prev.map((b) => (b.idBox === response.box.idBox ? response.box : b))
      );
      setOpenModalEdit(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
      });
    }
  };

  // Eliminar
  const confirmarEliminacion = async () => {
    const response = await deleteBox(boxAEliminar.idBox);
    if (response.success) {
      setBoxes((prev) => prev.filter((b) => b.idBox !== boxAEliminar.idBox));
      setOpenDialog(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'success', variant: 'outlined' },
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
      });
    }
  };

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
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'success', variant: 'outlined' },
        });
      } else {
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'error', variant: 'outlined' },
        });
      }
    } catch (error) {
      console.error('Error al actualizar state:', error);
    } finally {
      setOpenModalState(false);
      setBoxState(null);
      setNewState(null);
    }
  };

  // Render
  return (
    <>
      <ReactTable
        columns={columns}
        data={boxes}
        onAdd={permisos[0]?.crear === 1 ? () => setOpenModalAdd(true) : undefined}
        onEdit={permisos[0]?.editar === 1 ? (row) => { setBoxSeleccionado(row); setOpenModalEdit(true); } : undefined}
        onDelete={permisos[0]?.eliminar === 1 ? (row) => { setBoxAEliminar(row); setOpenDialog(true); } : undefined}
        height={windowHeight - 349}
        loading={loading}
      />

      <ModalAgregar
        open={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        onSave={handleGuardarCambios}
        columns={columns}
        entity="box"
        entityConfirm="el box"
      />

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
        entity="el box"
      />

      <ModalState
        open={openModalState}
        onClose={() => setOpenModalState(false)}
        onConfirm={handleConfirmState}
        fila={boxState?.box}
        entity="el box"
        state={boxState?.state}
        newState={newState}
      />
    </>
  );
}
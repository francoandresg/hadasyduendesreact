import { useEffect, useState, useMemo } from 'react';
import ReactTable from '../../components/tabla/pagination/ReactTable';
import ModalAgregar from '../../components/modal/ModalAgregar';
import ModalEditar from '../../components/modal/ModalEditar';
import ModalEliminar from '../../components/modal/ModalEliminar';
import ModalEstado from '../../components/modal/ModalEstado';
import { getAllBoxes, createBox, updateBox, deleteBox, updateEstado } from '../../api/maintainers/boxes';
import { openSnackbar } from 'utils/snackbar';
import { Switch } from '@mui/material';

export default function WidgetBoxes() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(true);

  const [boxes, setTeams] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  //Agregar
  const [openModalAdd, setOpenModalAdd] = useState(false);

  // Editar
  const [teamSeleccionado, setTeamSeleccionado] = useState(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  // Eliminar
  const [teamAEliminar, setTeamAEliminar] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Estado
  const [teamEstado, setTeamEstado] = useState(null);
  const [openModalEstado, setOpenModalEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!project || !project.id) {
          setLoading(false);
          return;
        }

        const data = await getAllTeams(project.id);
        setTeams(data.result.boxes);
        setColumnDefs(data.result.columnas);
        setPermisos(data.result.permisos);

        const visibilityMap = {};
        data.result.columnas.forEach((col) => {
        visibilityMap[col.accessorKey] = col.visible === 1;
        });
        setColumnVisibility(visibilityMap);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener box:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(() => {
  return columnDefs.map((col) => {
      const baseColumn = {
      header: col.header,
      accessorKey: col.accessorKey,
      type: col.type,
      valueType: col.valueType,
      valueName: col.valueName,
      required: col.required || 0,
      actions: col.actions || 0,
      crear: col.crear || 0,
      editar: col.editar || 0,
      enableHiding: true,
      visible: col.visible === 1
      };

      // Select
      if (col.type === 'select') {
      baseColumn.options = col.options;
      }

      // Switch
      if (col.accessorKey === 'estado') {
        baseColumn.cell = (row) => {
          const estado = row.row.original.estado === 1;
          const handleChange = (event) => {
            const nuevoValor = event.target.checked ? 1 : 0;
            setTeamEstado(row.row.original);
            setNuevoEstado(nuevoValor);
            setOpenModalEstado(true);
          };

          return (
            <Switch
              checked={estado}
              onChange={handleChange}
              color="primary"
              size="small"
            />
          );
        };
      }

      return baseColumn;
  });
  }, [columnDefs]);

  // Manejar visibilidad columnas
  const visibleColumns = useMemo(() => {
  return columns.filter((col) => columnVisibility[col.accessorKey] === true);
  }, [columns, columnVisibility]);

  // Manejar clic en agregar
  const handleAdd = () => {
    setOpenModalAdd(true);
  };

  // Cerrar modal de agregar
  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
  };

  // Guardar cambios al agregar
  const handleGuardarCambios = async (datosNuevos) => {
    const response = await createTeam(datosNuevos);
    
    if (response.success) {
      setTeams((prev) => [response.team, ...prev]);
      setOpenModalAdd(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'outlined',
        },
        close: true,
        transition: 'SlideRight',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 5000,
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'outlined',
        },
        close: true,
        transition: 'SlideRight',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 5000,
      });
    }
  };

  // Manejar clic en editar
  const handleEdit = (boxes) => {
    setTeamSeleccionado(boxes);
    setOpenModalEdit(true);
  };

  // Cerrar modal de editar
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setTeamSeleccionado(null);
  };

  // Guardar cambios editados
  const handleEditarCambios = async (datosEditados) => {
    const response = await updateTeam(datosEditados);
    if (response.success) {
      setTeams((prev) => prev.map((t) => (t.idTeam === response.team.idTeam ? response.team : t)));
      setOpenModalEdit(false);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'outlined'
        },
        close: true,
        transition: 'SlideRight',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 5000
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'outlined'
        },
        close: true,
        transition: 'SlideRight',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 5000
      });
    }
  };

  // Manejar clic en eliminar
  const handleDelete = (team) => {
    setTeamAEliminar(team);
    setOpenDialog(true);
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    var response = await deleteTeam(teamAEliminar.idTeam);
    if (response.success) {
      if (teamAEliminar) {
        setTeams((prev) => prev.filter((t) => t.idTeam !== teamAEliminar.idTeam));
      }
      setOpenDialog(false);
      setTeamAEliminar(null);
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'outlined'
        },
        close: true,
        transition: 'SlideRight',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 5000
      });
    } else {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'outlined'
        },
        close: true,
        transition: 'SlideRight',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 5000
      });
    }
  };

  // Ícono
  const handleEstado = (teamObj) => {
    const nuevoValor = teamObj.estado === 1 ? 0 : 1;
    setTeamEstado(teamObj);
    setNuevoEstado(nuevoValor);
    setOpenModalEstado(true);
  };

  // Cerrar modal
  const handleCloseEstado = () => {
    setOpenModalEstado(false);
    setTimeout(() => {
      setTeamEstado(null);
      setNuevoEstado(null);
    }, 300);
  };

  // Confirmar cambio de estado (switch + ícono)
  const handleConfirmEstado = async () => {
    if (!teamEstado) return;
    try {
      const response = await updateEstado(teamEstado.idTeam, nuevoEstado);
      if (response.success) {
        setTeams((prev) =>
          prev.map((t) =>
            t.idTeam === teamEstado.idTeam ? { ...t, estado: nuevoEstado } : t
          )
        );
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'success', variant: 'outlined' },
          close: true,
          transition: 'SlideRight',
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          autoHideDuration: 5000,
        });
      } else {
        openSnackbar({
          open: true,
          message: response.message,
          variant: 'alert',
          alert: { color: 'error', variant: 'outlined' },
          close: true,
          transition: 'SlideRight',
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          autoHideDuration: 5000,
        });
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    } finally {
      handleCloseEstado();
    }
  };

  return (
    <>
      <ReactTable
        columns={visibleColumns}
        data={boxes}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        onAdd={permisos[0]?.crear === 1 ? handleAdd : undefined}
        onEdit={permisos[0]?.editar === 1 ? handleEdit : undefined}
        onDelete={permisos[0]?.eliminar === 1 ? handleDelete : undefined}
        deleteMode="real" //Eliminar de verdad
        height={windowHeight - 349}
        rowsPadding={1.59}
        loading={loading}
      />
      <ModalAgregar
        open={openModalAdd}
        onClose={handleCloseModalAdd}
        onSave={handleGuardarCambios}
        columns={columns}
        entity={'team'}
        entityConfirm={'el team'}
      />
      <ModalEditar
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        data={teamSeleccionado}
        onSave={handleEditarCambios}
        columns={columns}
        entity={'team'}
        entityConfirm={'el team'}
      />
      <ModalEliminar
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmarEliminacion}
        deleteMode="real" // Elimina de verdad
        fila={teamAEliminar?.team}
        entity={'el team'}
      />
      <ModalEstado
        open={openModalEstado}
        onClose={handleCloseEstado}
        onConfirm={handleConfirmEstado}
        fila={teamEstado?.team}
        entity="el team"
        estado={teamEstado?.estado}
        nuevoEstado={nuevoEstado}
      />
    </>
  );
}
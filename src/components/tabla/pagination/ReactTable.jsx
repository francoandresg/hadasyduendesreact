import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import { Typography } from '@mui/material';
import { PlusIcon, ExportIcon, TrashIcon, PencilLineIcon, EyeIcon, CheckCircleIcon} from '@phosphor-icons/react';
import SimpleBar from 'components/third-party/SimpleBar';
import { exportToExcel } from 'utils/exportToExcel';
import { DebouncedInput, HeaderSort } from 'components/third-party/react-table';
import { LoadingSkeleton } from 'components/tabla/pagination/LoadingSkeleton';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  useReactTable
} from '@tanstack/react-table';

import { globalStrictFilter } from 'utils/tableUtils';

import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

function ReactTable({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  onExport = true,
  onView,
  onConfirm,
  onRowClick,
  loading = true,
  pointer,
  height,
  groupedHeaders,
  isExpanded,
  onToggleExpand,
  showControls = true,
  rowsPadding,
  padding = false,
  pageLength = 10,
  title,
  deleteMode = 'soft'
}) {
  const [sorting, setSorting] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageLength
  });

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (!showControls) {
      setPagination({ pageIndex: 0, pageSize: pageLength });
    }
  }, [showControls]);

  useEffect(() => {
    if (showControls) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0
      }));
    }
  }, [data, globalFilter]);

  const dynamicColumns = useMemo(() => {
    if (onEdit || onDelete || onView || onConfirm) {
      return [
        ...columns,
        {
          id: 'acciones',
          header: 'Acciones',
          cell: ({ row }) => {
            const { estado } = row.original;

            return (
              <Stack direction="row" spacing={1}>
                {onView && (
                  <IconButton
                    color="info"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row?.original) onView(row.original);
                    }}
                  >
                    <EyeIcon weight="duotone" />
                  </IconButton>
                )}

                {onEdit && (
                  <IconButton
                    title="Editar"
                    color="warning"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row?.original) onEdit(row.original);
                    }}
                  >
                    <PencilLineIcon weight="duotone" />
                  </IconButton>
                )}

                {/* 👇 Aquí la diferencia entre "real" y "soft" */}
                {onDelete && (
                  <>
                    {deleteMode === 'soft' ? (
                      <>
                        {estado === 1 && (
                          <IconButton
                            title="Desactivar"
                            color="error"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (row?.original) onDelete(row.original);
                            }}
                          >
                            <TrashIcon weight="duotone" />
                          </IconButton>
                        )}
                        {(estado === 0 || estado === 2) && onConfirm && (
                          <IconButton
                            title="Activar"
                            color="success"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onConfirm?.(row.original);
                            }}
                          >
                            <CheckCircleIcon size={32} weight="duotone" />
                          </IconButton>
                        )}
                      </>
                    ) : (
                      <IconButton
                        title="Eliminar"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (row?.original) onDelete(row.original);
                        }}
                      >
                        <TrashIcon weight="duotone" />
                      </IconButton>
                    )}
                  </>
                )}
              </Stack>
            );
          },
          enableSorting: false
        }
      ];
    }
    return columns;
  }, [columns, onEdit, onDelete, onView, onConfirm, deleteMode]);

  const table = useReactTable({
    data,
    columns: dynamicColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      ...(showControls && { pagination })
    },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    ...(showControls && { onPaginationChange: setPagination }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(showControls && { getPaginationRowModel: getPaginationRowModel() }),
    globalFilterFn: globalStrictFilter
  });

  const headers = table.getAllColumns().map((col) => ({
    label: typeof col.columnDef.header === 'string' ? col.columnDef.header : '#',
    key: col.columnDef.accessorKey || col.id
  }));

  const pageCount = table.getPageCount();

  return loading ? (
    <LoadingSkeleton columns={columns} height={height} rowsPadding={rowsPadding} showControls={showControls} pageLength={pageLength} />
  ) : (
    <Paper elevation={0} sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: theme.palette.divider }}>
      {/* Filtros y acciones */}
      {title && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'center', sm: 'center' }}
          justifyContent="space-between"
          sx={{ px: 2, py: 1 }}
        >
          <Typography variant="h5">{title}</Typography>
        </Stack>
      )}

      {showControls && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'center', sm: 'center' }}
          justifyContent="space-between"
          sx={{ px: 2, py: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {onExport && (
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  exportToExcel(
                    table.getFilteredRowModel().rows.map((d) => d.original),
                    headers,
                    'datos-exportados.xlsx'
                  )
                }
                sx={{
                  minWidth: 'auto',
                  width: 40,
                  height: 40,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ExportIcon weight="duotone" fontSize="small" />
              </Button>
            )}
            {onAdd && (
              <Button
                color="primary"
                variant="contained"
                onClick={onAdd}
                sx={{
                  minWidth: 'auto',
                  width: 40,
                  height: 40,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PlusIcon weight="duotone" fontSize="small" />
              </Button>
            )}

            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Buscar en ${data.length} registros...`}
            />
          </Stack>

          {/* Selector de cantidad de filas */}
          {showControls && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <InputLabel id="page-size-label" sx={{ marginRight: '5px' }}>
                Filas
              </InputLabel>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  labelId="page-size-label"
                  id="page-size"
                  value={pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 15, 20, 30, 50].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Stack>
      )}

      {/* Tabla */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          ...(height ? { height } : {}),
          borderRadius: 0,
          overflow: 'hidden'
        }}
      >
        <SimpleBar style={{ height: '100%', flexGrow: 1 }}>
          <Table
            sx={{
              borderRadius: 0,
              borderCollapse: 'inherit',
              minHeight: '100%'
            }}
          >
            <TableHead className="sticky-header">
              {groupedHeaders && (
                <TableRow>
                  {groupedHeaders.map((group, idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      colSpan={group.colSpan}
                      sx={{
                        backgroundColor: group.bgColor || 'transparent',
                        color: group.color || 'inherit',
                        fontWeight: 'bold',
                        padding: '6px 16px'
                      }}
                    >
                      {group.label}
                    </TableCell>
                  ))}
                </TableRow>
              )}

              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} sx={{ whiteSpace: 'nowrap' }}>
                  {headerGroup.headers.map((header) => {
                    const bgColor = header.column.columnDef?.color;
                    return (
                      <TableCell
                        key={header.id}
                        {...header.column.columnDef.meta}
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={header.column.getCanSort() ? 'cursor-pointer prevent-select' : undefined}
                        sx={{
                          ...(!!bgColor && { color: bgColor }),
                          borderTop: showControls && '1px solid rgba(197, 197, 197, 0.28)', // borde superior
                          borderBottom: '1px solid rgba(197, 197, 197, 0.28) !important' // borde inferior
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                            {header.column.getCanSort() && <HeaderSort column={header.column} />}
                          </Stack>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    '&:hover': { backgroundColor: 'inherit' },
                    whiteSpace: 'nowrap'
                  }}
                  style={{ cursor: pointer }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      {...cell.column.columnDef.meta}
                      sx={{
                        borderBottom: '1px solid rgba(197, 197, 197, 0.28) !important', // 👈 agregado aquí
                        padding: padding ? '0px !important' : '9px !important'
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SimpleBar>
      </TableContainer>

      {/* Paginación */}
      {showControls && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'center', sm: 'center' }}
          justifyContent="space-between"
          sx={{ px: 1, py: 1, borderTop: '1px solid rgba(197, 197, 197, 0.28)' }}
        >
          <Box sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            Página {pagination.pageIndex + 1} de {pageCount}
          </Box>
          <Pagination
            count={pageCount}
            page={pagination.pageIndex + 1}
            onChange={(_, page) => table.setPageIndex(page - 1)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </Paper>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  onView: PropTypes.func,
  onConfirm: PropTypes.func,
  onExport: PropTypes.bool,
  onRowClick: PropTypes.func,
  loading: PropTypes.bool,
  height: PropTypes.number,
  pointer: PropTypes.string,
  groupedHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      colSpan: PropTypes.number.isRequired
    })
  ),
  isExpanded: PropTypes.bool,
  onToggleExpand: PropTypes.func,
  showControls: PropTypes.bool,
  rowsPadding: PropTypes.number,
  padding: PropTypes.bool,
  pageLength: PropTypes.number,
  title: PropTypes.string,
  deleteMode: PropTypes.oneOf(['real', 'soft'])
};

export default ReactTable;
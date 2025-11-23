import PropTypes from 'prop-types';
import { useState, useMemo, useCallback } from 'react';

// MUI
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Box,
  Button,
  IconButton,
  Pagination,
  Typography,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Divider
} from '@mui/material';

// Icons
import { PlusIcon, ExportIcon, TrashIcon, PencilLineIcon, EyeIcon } from '@phosphor-icons/react';

// Utils
import SimpleBar from 'components/third-party/SimpleBar';
import { exportToExcel } from 'utils/exportToExcel';
import { DebouncedInput, HeaderSort } from 'components/third-party/react-table';
import { LoadingSkeleton } from 'components/tabla/pagination/LoadingSkeleton';
import { globalStrictFilter } from 'utils/tableUtils';

// React-Table
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  useReactTable
} from '@tanstack/react-table';

// 🟦 Extraer columna Acciones → mucho más limpio
const useActionsColumn = ({ onEdit, onDelete, onView }) => {
  return useMemo(() => {
    if (!onEdit && !onDelete && !onView) return [];

    return [
      {
        id: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            {onView && (
              <IconButton
                color="info"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(row.original);
                }}
              >
                <EyeIcon weight="duotone" />
              </IconButton>
            )}

            {onEdit && (
              <IconButton
                color="warning"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row.original);
                }}
              >
                <PencilLineIcon weight="duotone" />
              </IconButton>
            )}

            {onDelete && (
              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row.original);
                }}
              >
                <TrashIcon weight="duotone" />
              </IconButton>
            )}
          </Stack>
        )
      }
    ];
  }, [onEdit, onDelete, onView]);
};

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
  showControls = true,
  padding = false,
  pageLength = 10,
  title
}) {
  // ---------------------------
  // STATES
  // ---------------------------
  const [sorting, setSorting] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageLength
  });

  // ---------------------------
  // MEMOS
  // ---------------------------
  const actionsColumn = useActionsColumn({ onEdit, onDelete, onView });

  const dynamicColumns = useMemo(() => {
    return [...columns, ...actionsColumn];
  }, [columns, actionsColumn]);

  const table = useReactTable({
    data,
    columns: dynamicColumns,
    state: { sorting, columnFilters, globalFilter, ...(showControls && { pagination }) },
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

  const headers = useMemo(
    () =>
      table.getAllColumns().map((col) => ({
        label: typeof col.columnDef.header === 'string' ? col.columnDef.header : '#',
        key: col.columnDef.accessorKey || col.id
      })),
    [table]
  );

  const pageCount = table.getPageCount();

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handleExport = useCallback(() => {
    exportToExcel(
      table.getFilteredRowModel().rows.map((d) => d.original),
      headers,
      'datos-exportados.xlsx'
    );
  }, [table, headers]);

  const handlePageSizeChange = useCallback((e) => table.setPageSize(Number(e.target.value)), [table]);

  // ---------------------------
  // RENDER
  // ---------------------------
  if (loading) {
    return <LoadingSkeleton columns={columns} height={height} showControls={showControls} pageLength={pageLength} />;
  }

  return (
    <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
      {/* ---------- TÍTULO ---------- */}
      {title && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1 }}>
          <Typography variant="h5">{title}</Typography>
        </Stack>
      )}

      {/* ---------- CONTROLES ---------- */}
      {showControls && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1 }}>
          <Stack direction="row" spacing={1}>
            {onExport && (
              <Button variant="contained" color="success" onClick={handleExport} sx={{ width: 40, height: 40, p: 0, minWidth: 'auto' }}>
                <ExportIcon weight="regular" />
              </Button>
            )}

            {onAdd && (
              <Button variant="contained" color="primary" onClick={onAdd} sx={{ width: 40, height: 40, p: 0, minWidth: 'auto' }}>
                <PlusIcon weight="regular" />
              </Button>
            )}

            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Buscar en ${data.length} registros...`}
              sx={{ height: 40 }}
            />
          </Stack>

          {/* Filas por página */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <InputLabel>Filas</InputLabel>
            <FormControl size="small" sx={{ minWidth: 90, height: 40 }}>
              <Select value={pagination.pageSize} onChange={handlePageSizeChange} style={{ height: 40 }}>
                {[10, 15, 20, 30, 50].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      )}

      {/* ---------- TABLA ---------- */}
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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} sx={{ whiteSpace: 'nowrap' }}>
                  {headerGroup.headers.map((header) => {
                    const bgColor = header.column.columnDef?.color;

                    return (
                      <TableCell
                        key={header.id}
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={header.column.getCanSort() ? 'cursor-pointer prevent-select' : undefined}
                        sx={{
                          ...(bgColor && { color: bgColor }),
                          paddingLeft: '12px !important',

                          position: 'sticky',
                          top: 0,
                          zIndex: 1,

                          backgroundColor: (theme) => `${theme.palette.background.default}`,

                          borderTop: (theme) => `1px solid ${theme.palette.divider} !important`,
                          borderBottom: (theme) => `1px solid ${theme.palette.divider} !important`
                        }}
                      >
                        {!header.isPlaceholder && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            {flexRender(header.column.columnDef.header, header.getContext())}
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
              {table.getRowModel().rows.map((row, index) => {
                const isLast = index === table.getRowModel().rows.length - 1;

                return (
                  <TableRow key={row.id} onClick={() => onRowClick?.(row)} sx={{ '&:hover': { backgroundColor: 'inherit !important' } }}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        sx={{
                          borderBottom: isLast
                            ? (theme) => `1px solid ${theme.palette.divider} !important`
                            : (theme) => `1px solid ${theme.palette.divider} !important`,
                          borderColor: 'divider',
                          padding: padding ? '0px !important' : '9px !important'
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </SimpleBar>
      </TableContainer>

      {/* ---------- PAGINACIÓN ---------- */}
      {showControls && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Typography variant="body2">
            Página {pagination.pageIndex + 1} de {pageCount}
          </Typography>

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
  showControls: PropTypes.bool,
  padding: PropTypes.bool,
  pageLength: PropTypes.number,
  title: PropTypes.string
};

export default ReactTable;

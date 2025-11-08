import {
  Skeleton,
  TableCell,
  TableRow,
  Paper,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody
} from '@mui/material';
import SimpleBar from 'components/third-party/SimpleBar';
import { useTheme } from '@mui/material/styles';

export function LoadingSkeleton({ columns, height, rowsPadding, showControls, pageLength = 10 }) {
  const theme = useTheme();

  const fakePageIndex = 1;
  const fakePageCount = 5;

  // Padding opcional
  const optionalPadding = rowsPadding !== undefined ? { sx: { padding: rowsPadding } } : {};
  const skeletonSx = rowsPadding !== undefined
    ? { sx: { borderRadius: 1, padding: rowsPadding } }
    : { sx: { borderRadius: 1 } };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: theme.palette.divider
      }}
    >
      {/* Header general (fuera de la tabla) */}
      {showControls && <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: 1.5 }}
      >
        <Skeleton variant="rectangular" width={300} height={35} sx={{ borderRadius: 1 }} animation="wave" />
        <Skeleton variant="rectangular" width={300} height={35} sx={{ borderRadius: 1 }} animation="wave" />
      </Stack>}

      {/* Tabla con Skeleton largo por fila */}
      <TableContainer component={Paper} sx={{ borderRadius: 0 }} style={{ height, overflow: 'hidden' }}>
        <SimpleBar style={{ maxHeight: height }}>
          <Table sx={{ borderRadius: 0, borderCollapse: 'inherit' }}>
            {/* Header de la tabla (thead) con un solo skeleton */}
            <TableHead>
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ padding: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    height={18}
                    animation="wave"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Body de la tabla con un solo skeleton por fila */}
            <TableBody>
              {[...Array(pageLength)].map((_, rowIndex) => (
                <TableRow key={rowIndex} {...optionalPadding}>
                  <TableCell colSpan={columns.length} {...optionalPadding}>
                    <Skeleton
                      variant="rectangular"
                      height={18}
                      animation="wave"
                      {...skeletonSx}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SimpleBar>
      </TableContainer>

      {/* Footer (ej. paginación) */}
      {showControls && <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: 1.5 }}
      >
        <Skeleton variant="rectangular" width={300} height={30} sx={{ borderRadius: 1 }} animation="wave" />
        <Skeleton variant="rectangular" width={400} height={30} sx={{ borderRadius: 1 }} animation="wave" />
      </Stack>}
    </Paper>
  );
}
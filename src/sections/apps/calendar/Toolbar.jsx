import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import CustomTooltip from 'components/@extended/Tooltip';
import { useTheme } from '@mui/material/styles';

// third-party
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // para formatear fechas en español

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { ArrowLeft2, ArrowRight2, Calendar1, Category, Grid6, TableDocument } from 'iconsax-reactjs';


// constant
const viewOptions = [
  {
    label: 'Mes',
    value: 'dayGridMonth',
    icon: Category
  },
  {
    label: 'Semana',
    value: 'timeGridWeek',
    icon: Grid6
  },
  {
    label: 'Día',
    value: 'timeGridDay',
    icon: Calendar1
  },
  {
    label: 'Agenda',
    value: 'listWeek',
    icon: TableDocument
  }
];

// ==============================|| CALENDAR - TOOLBAR ||============================== //

export default function Toolbar({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView }) {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [viewFilter, setViewFilter] = useState(viewOptions);

  useEffect(() => {
    if (matchDownSM) {
      const filter = viewOptions.filter((item) => item.value !== 'dayGridMonth' && item.value !== 'timeGridWeek');
      setViewFilter(filter);
    } else {
      setViewFilter(viewOptions);
    }
  }, [matchDownSM]);

  return (
    <Grid alignItems="center" container justifyContent="space-between" spacing={matchDownSM ? 1 : 3} sx={{ pb: 3 }}>
      <Grid item display={'flex'}>
        <IconButton variant="outlined" borderPosition="left" onClick={onClickPrev} size={matchDownSM ? 'small' : 'medium'}>
          <ArrowLeft2 variant='Bulk' />
        </IconButton>
        <Box sx={{ marginRight: 1 }}>
          <IconButton variant="outlined" borderPosition="right" onClick={onClickNext} size={matchDownSM ? 'small' : 'medium'}>
            <ArrowRight2 variant='Bulk'/>
          </IconButton>
        </Box>
        <Button variant="outlined" onClick={onClickToday} size={matchDownSM ? 'small' : 'medium'}>
          Hoy
        </Button>
      </Grid>
      <Grid item>
        <Stack direction="row" alignItems="center" spacing={matchDownSM ? 1 : 3}>
          <Typography variant={matchDownSM ? 'h5' : 'h5'} color="text.primary">
            {format(date, 'MMMM yyyy', { locale: es }).toUpperCase()}
          </Typography>
        </Stack>
      </Grid>
      <Grid item>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {viewFilter.map((viewOption) => {
            const Icon = viewOption.icon;
            return (
              <CustomTooltip
                title={viewOption.label}
                color={isDarkMode ? '#333' : '#fff'} // Fondo
                labelColor={isDarkMode ? '#fff' : '#000'} // Texto
                key={viewOption.value}
              >
                <Button
                  size={matchDownSM ? 'small' : 'large'}
                  disableElevation
                  variant={viewOption.value === view ? 'contained' : 'outlined'}
                  onClick={() => onChangeView(viewOption.value)}
                >
                  <Icon variant='Bulk' />
                </Button>
              </CustomTooltip>
            );
          })}
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

Toolbar.propTypes = {
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.any]),
  view: PropTypes.string,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  onClickToday: PropTypes.func,
  onChangeView: PropTypes.func
};
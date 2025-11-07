import PropTypes from 'prop-types';

// material-ui
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

// ==============================|| COLUMN SORTING - SELECT ||============================== //

export default function SelectColumnSorting({ getState, getAllColumns, setSorting, size = 'medium' }) {
  const handleChange = (event) => {
    setSorting([{ id: event.target.value, desc: false }]);
  };

  const sortingState = getState().sorting;
  const selectedColumnId = sortingState.length > 0 ? sortingState[0].id : '';

  return (
    <FormControl sx={{ width: 200 }} size={size}>
      <Select
        id="column-sorting"
        displayEmpty
        onChange={handleChange}
        value={selectedColumnId}
        input={<OutlinedInput id="select-column-sorting" placeholder="Select column" />}
        renderValue={(value) => {
          const selectedColumn = getAllColumns().find((col) => col.id === value);
          return (
            <Typography variant="subtitle2">
              {selectedColumn
                ? `Sort by (${typeof selectedColumn.columnDef.header === 'string' ? selectedColumn.columnDef.header : '#'})`
                : 'Sort By'}
            </Typography>
          );
        }}
      >
        {getAllColumns()
          .filter((col) => col.columnDef.accessorKey && col.getCanSort())
          .map((col) => (
            <MenuItem key={col.id} value={col.id}>
              <ListItemText primary={typeof col.columnDef.header === 'string' ? col.columnDef.header : '#'} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

SelectColumnSorting.propTypes = {
  getState: PropTypes.func,
  getAllColumns: PropTypes.func,
  setSorting: PropTypes.func,
  size: PropTypes.string
};

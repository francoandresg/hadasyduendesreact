import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// assets
import { Heart, Share } from 'iconsax-reactjs';

// ==============================|| SOCIAL PROFILE - FEEDBACK ACTIONS ||============================== //

export default function FeedbackActions({ ml = 8 }) {
  return (
    <Stack direction="row" sx={{ gap: 1, my: 3, ml }}>
      <Button color="secondary" startIcon={<Heart />}>
        450
      </Button>
      <Button color="secondary" startIcon={<Share />}>
        100
      </Button>
    </Stack>
  );
}

FeedbackActions.propTypes = { ml: PropTypes.number };

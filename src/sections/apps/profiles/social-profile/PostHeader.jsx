import PropTypes from 'prop-types';

// material-ui
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import Avatar from 'components/@extended/Avatar';

// ==============================|| SOCIAL PROFILE - POST HEADER ||============================== //

export default function PostHeader({ header, subHeader, avatarImg, status }) {
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Badge color={status} overlap="circular" variant="dot" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Avatar alt={'User'} src={avatarImg} />
      </Badge>
      <Stack>
        <Typography variant="h5">{header}</Typography>
        <Typography variant="caption">{subHeader}</Typography>
      </Stack>
    </Stack>
  );
}

PostHeader.propTypes = { header: PropTypes.string, subHeader: PropTypes.string, avatarImg: PropTypes.string, status: PropTypes.string };

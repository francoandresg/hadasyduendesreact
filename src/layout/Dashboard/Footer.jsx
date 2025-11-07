import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-import
import { useBuyNowLink } from 'hooks/buyNowLink';

// ==============================|| MAIN LAYOUT - FOOTER ||============================== //

export default function Footer() {
  const { isPhoenix } = useBuyNowLink();

  const SupportLink = isPhoenix ? 'https://phoenixcoded.authordesk.app/' : 'https://codedthemes.support-hub.io/';

  return (
    <Stack direction={{ sm: 'row' }} sx={{ gap: 1, justifyContent: 'end', alignItems: 'center', pt: 3, mt: 'auto' }}>
      <Typography variant="body2" fontSize={13} fontWeight={'light'}>
        Copyright © 2025 {' '}
        <Link href="javascript:void(0);" underline="none">
          {' '}
          Hadas y Duendes
        </Link>. Todos los Derechos Reservados.
      </Typography>
    </Stack>
  );
}

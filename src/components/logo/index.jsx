import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom'; // 👈 importa useLocation

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project-imports
import Logo from './LogoMain';
import LogoV2 from './LogoV2';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from 'config';
import { useBuyNowLink } from 'hooks/buyNowLink';
import useAuth from 'hooks/useAuth';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection({ isIcon, sx, to }) {
  const { isLoggedIn } = useAuth();
  const { getQueryParams } = useBuyNowLink();
  const location = useLocation(); // 👈 hook para saber la URL actual

  const isLoginPage = location.pathname === '/login'; // 👈 chequea si estás en /login

  return (
    <ButtonBase
      disableRipple
      {...(isLoggedIn && { component: Link, to: !to ? APP_DEFAULT_PATH + getQueryParams : to, sx })}
    >
      {/* 👇 Podés condicionar el logo si querís cambiarlo según la ruta */}
      {isIcon ? <LogoIcon /> : isLoginPage ? <LogoV2 /> : <Logo />}
    </ButtonBase>
  );
}

LogoSection.propTypes = {
  isIcon: PropTypes.bool,
  sx: PropTypes.any,
  to: PropTypes.any
};

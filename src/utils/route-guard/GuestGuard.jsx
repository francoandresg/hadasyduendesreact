import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import { useBuyNowLink } from 'hooks/buyNowLink';
import useAuth from 'hooks/useAuth';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }) {
  const { isLoggedIn } = useAuth();
  const { getQueryParams } = useBuyNowLink();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(location?.state?.from ? location?.state?.from : APP_DEFAULT_PATH + getQueryParams, {
        state: { from: '' },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location, getQueryParams]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };

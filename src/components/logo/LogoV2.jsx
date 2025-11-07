// material-ui
import { useTheme } from '@mui/material/styles';
import Logo from 'assets/images/logo_hyd_white.svg';
import LogoDark from 'assets/images/logo_hyd_dark.svg';
import Chip from '@mui/material/Chip';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="icon logo" width="100" />
     *
     */
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
        {/* <img src={LogoMundoAraucoDark} alt="icon logo" width="29" /> */}
        <img src={theme.palette.mode === 'dark' ? Logo : LogoDark} alt="icon logo" width="370" />
      </div>
    </>
  );
}
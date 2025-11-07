// material-ui
import { useTheme } from '@mui/material/styles';
import Logo from 'assets/images/logo_pestaña.svg';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="icon logo" width="100" />
     *
     */
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* <img src={LogoMundoAraucoDark} alt="icon logo" width="29" /> */}
      <img src={Logo} alt="icon logo" width="50" />
    </div>
  );
}

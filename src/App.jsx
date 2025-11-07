import { RouterProvider } from 'react-router-dom';
import { Box } from '@mui/material';

// project-imports
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Customization from 'components/Customization';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <Box>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <ScrollTop>
              <AuthProvider>
                <Box>
                  <Notistack>
                    <RouterProvider router={router} />
                    <Customization />
                    <Snackbar />
                  </Notistack>
                </Box>
              </AuthProvider>
            </ScrollTop>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </Box>
  );
}
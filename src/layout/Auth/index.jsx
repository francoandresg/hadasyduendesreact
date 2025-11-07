import { Outlet } from 'react-router-dom';

// project-imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import PageTitleUpdater from 'components/PageTitleUpdater';

// ==============================|| LAYOUT - AUTH ||============================== //

export default function AuthLayout() {
  return (
    <GuestGuard>
      <PageTitleUpdater />
      <Outlet />
    </GuestGuard>
  );
}

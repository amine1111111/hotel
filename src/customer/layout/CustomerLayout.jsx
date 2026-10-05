
import { Outlet } from "react-router-dom";

import CustomerNavigation from "../components/CustomerNavigation";
import PageTransition from "../components/PageTransition";

const CustomerLayout = () => {
  return (
    <PageTransition>
      <CustomerNavigation />

      <main>
        <Outlet />
      </main>
    </PageTransition>
  );
};

export default CustomerLayout;
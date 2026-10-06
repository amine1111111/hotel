// import { Outlet } from "react-router-dom"

// import CustomerNavigation from "../components/CustomerNavigation"
// import Footer from "../components/Footer"
// import PageTransition from "../components/PageTransition"

// const CustomerLayout = () => {
//   return (
//     <PageTransition>
//       <CustomerNavigation />

//       <main>
//         <Outlet />
//       </main>

//       <Footer />
//     </PageTransition>
//   )
// }

// export default CustomerLayout



























import { Outlet, useLocation } from "react-router-dom"

import CustomerNavigation from "../components/CustomerNavigation"
import Footer from "../components/Footer"
import PageTransition from "../components/PageTransition"

const CustomerLayout = () => {
  const location = useLocation()

  const hideFooter =
    location.pathname === "/gallery" ||
    location.pathname.startsWith("/rooms") ||
    location.pathname.startsWith("/booking")

  return (
    <PageTransition>
      <CustomerNavigation />

      <main>
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </PageTransition>
  )
}

export default CustomerLayout
import { Outlet } from "react-router-dom"

import QueryProvider from "../../providers/QueryProvider"

const CustomerDataLayout = () => {
  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  )
}

export default CustomerDataLayout
// import { RouterProvider } from 'react-router-dom'
// import router from './router'

// function App() {
//   // console.log("my frontend app")
//   return <RouterProvider router={router} />
// }

// export default App


import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'

import router from './router'

function App() {
  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
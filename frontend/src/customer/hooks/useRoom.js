// import { useQuery } from '@tanstack/react-query'
// import { getRoom } from '../../api/rooms'

// const useRoom = (id) => {
//   return useQuery({
//     queryKey: ['room', id],
//     queryFn: () => getRoom(id),
//     enabled: Boolean(id),
//   })
// }

// export default useRoom

import { useQuery } from '@tanstack/react-query'
import { getRoom } from '../../api/rooms'

const useRoom = (id) => {
  const query = useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoom(id),
    enabled: Boolean(id),
  })

  console.log('useRoom - id:', id)
  console.log('useRoom - data:', query.data)
  console.log('useRoom - loading:', query.isLoading)
  console.log('useRoom - error:', query.error)

  return query
}

export default useRoom
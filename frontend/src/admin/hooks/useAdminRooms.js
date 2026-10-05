

import { useQuery } from '@tanstack/react-query'
import { getAdminRooms } from '../../api/adminRooms'

const useAdminRooms = () => {
  const query = useQuery({
    queryKey: ['admin', 'rooms'],
    queryFn: getAdminRooms,
  })

  console.log('🟦 [ADMIN ROOMS HOOK] Query state:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    rooms: query.data?.rooms?.length ?? 0,
  })

  if (query.isError) {
    console.error(
      '🟥 [ADMIN ROOMS HOOK] Query error:',
      query.error,
    )
  }

  if (query.isSuccess) {
    console.log(
      '🟩 [ADMIN ROOMS HOOK] Admin room data loaded successfully:',
      query.data,
    )
  }

  return query
}

export default useAdminRooms
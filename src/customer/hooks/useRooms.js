import { useQuery } from '@tanstack/react-query'
import { getRooms } from '../../api/rooms'

const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
  })
}

export default useRooms
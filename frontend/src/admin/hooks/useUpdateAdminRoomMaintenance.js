import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  updateAdminRoomMaintenance,
} from '../../api/adminRooms'

const useUpdateAdminRoomMaintenance = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      roomId,
      maintenance,
    }) =>
      updateAdminRoomMaintenance(
        roomId,
        maintenance,
      ),

    onSuccess: (data, variables) => {
      console.log(
        '🟩 [ADMIN ROOM HOOK] Maintenance mutation succeeded:',
        {
          roomId: variables.roomId,
          maintenance: variables.maintenance,
          data,
        },
      )

      // Refetch admin room data so status and overview are immediately updated.
      queryClient.invalidateQueries({
        queryKey: ['admin', 'rooms'],
      })
    },

    onError: (error, variables) => {
      console.error(
        '🟥 [ADMIN ROOM HOOK] Maintenance mutation failed:',
        {
          roomId: variables.roomId,
          maintenance: variables.maintenance,
          status: error.status,
          message: error.message,
          data: error.data,
        },
      )
    },

    onMutate: (variables) => {
      console.log(
        '🟧 [ADMIN ROOM HOOK] Starting maintenance mutation:',
        variables,
      )
    },
  })

  console.log(
    '🟦 [ADMIN ROOM HOOK] Mutation state:',
    {
      isPending: mutation.isPending,
      isError: mutation.isError,
      isSuccess: mutation.isSuccess,
    },
  )

  return mutation
}

export default useUpdateAdminRoomMaintenance
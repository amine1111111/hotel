import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createAdminRoom,
} from '../../api/adminRooms'

const useCreateAdminRoom = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      roomTypeId,
      roomNumber,
    }) =>
      createAdminRoom(
        roomTypeId,
        roomNumber,
      ),

    onSuccess: (data, variables) => {
      console.log(
        '🟩 [ADMIN ROOM HOOK] Physical room creation succeeded:',
        {
          roomTypeId:
            variables.roomTypeId,
          roomNumber:
            variables.roomNumber,
          data,
        },
      )

      queryClient.invalidateQueries({
        queryKey: ['admin', 'rooms'],
      })
    },

    onError: (error, variables) => {
      console.error(
        '🟥 [ADMIN ROOM HOOK] Physical room creation failed:',
        {
          roomTypeId:
            variables.roomTypeId,
          roomNumber:
            variables.roomNumber,
          status: error.status,
          message: error.message,
          data: error.data,
        },
      )
    },

    onMutate: (variables) => {
      console.log(
        '🟧 [ADMIN ROOM HOOK] Starting physical room creation:',
        variables,
      )
    },
  })

  console.log(
    '🟦 [ADMIN ROOM HOOK] Create room mutation state:',
    {
      isPending:
        mutation.isPending,
      isError:
        mutation.isError,
      isSuccess:
        mutation.isSuccess,
    },
  )

  return mutation
}

export default useCreateAdminRoom
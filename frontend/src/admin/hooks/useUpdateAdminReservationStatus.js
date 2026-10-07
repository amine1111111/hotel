
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  updateAdminReservationStatus,
} from '../../api/adminReservations'

const useUpdateAdminReservationStatus = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      reservationId,
      status,
    }) => {
      console.log(
        '========== FRONTEND ADMIN: STATUS MUTATION =========='
      )

      console.log(
        'Reservation ID:',
        reservationId
      )

      console.log(
        'Requested status:',
        status
      )

      return updateAdminReservationStatus(
        reservationId,
        status
      )
    },

    onMutate: async ({
      reservationId,
      status,
    }) => {
      console.log(
        '========== FRONTEND ADMIN: OPTIMISTIC UPDATE START =========='
      )

      console.log(
        'Optimistically updating reservation:',
        reservationId
      )

      console.log(
        'Optimistic new status:',
        status
      )

      // Stop an active refetch from overwriting
      // our optimistic update.
      await queryClient.cancelQueries({
        queryKey: ['admin', 'reservations'],
      })

      console.log(
        'Cancelled active reservations query'
      )

      // Save the current data in case we need
      // to roll back after an error.
      const previousReservations =
        queryClient.getQueryData([
          'admin',
          'reservations',
        ])

      console.log(
        'Previous reservations:',
        previousReservations
      )

      // Update the reservation immediately.
      queryClient.setQueryData(
        ['admin', 'reservations'],
        (currentReservations) => {
          if (!currentReservations) {
            console.log(
              'No current reservations found for optimistic update'
            )

            return currentReservations
          }

          const updatedReservations =
            currentReservations.map(
              (reservation) => {
                if (
                  reservation.id !==
                  reservationId
                ) {
                  return reservation
                }

                console.log(
                  'Optimistically updating reservation UI:',
                  reservation.id
                )

                return {
                  ...reservation,
                  status,
                }
              }
            )

          console.log(
            'Optimistic reservations:',
            updatedReservations
          )

          return updatedReservations
        }
      )

      console.log(
        '========== FRONTEND ADMIN: OPTIMISTIC UPDATE COMPLETE =========='
      )

      // This is returned to onError/onSettled.
      return {
        previousReservations,
      }
    },

    onSuccess: (updatedReservation) => {
      console.log(
        '========== FRONTEND ADMIN: STATUS UPDATE SUCCESS =========='
      )

      console.log(
        'Backend returned:',
        updatedReservation
      )

      console.log(
        'Reservation status confirmed by backend:',
        updatedReservation.status
      )
    },

    onError: (error, variables, context) => {
      console.error(
        '========== FRONTEND ADMIN: STATUS UPDATE FAILED =========='
      )

      console.error(
        'Update error:',
        error
      )

      console.log(
        'Rolling back optimistic update...'
      )

      if (context?.previousReservations) {
        queryClient.setQueryData(
          ['admin', 'reservations'],
          context.previousReservations
        )

        console.log(
          'Optimistic update rolled back'
        )
      }

      console.error(
        '========== FRONTEND ADMIN: OPTIMISTIC UPDATE ROLLBACK COMPLETE =========='
      )
    },

    onSettled: () => {
      console.log(
        '========== FRONTEND ADMIN: STATUS UPDATE SETTLED =========='
      )

      console.log(
        'Refetching reservations from backend...'
      )

      queryClient.invalidateQueries({
        queryKey: ['admin', 'reservations'],
      })

      console.log(
        'Reservations refetch requested'
      )
    },
  })

  console.log(
    'Frontend admin status mutation state:',
    {
      isPending: mutation.isPending,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      error: mutation.error,
    }
  )

  return mutation
}

export default useUpdateAdminReservationStatus
import { useEffect } from 'react'

import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { getAdminReservations } from '../../api/adminReservations'

import adminSocket from '../socket'

const useAdminReservations = () => {

  const queryClient = useQueryClient()

  const query = useQuery({

    queryKey: ['admin', 'reservations'],

    queryFn: getAdminReservations,

  })

  // =====================================================
  // FRONTEND ADMIN: RESERVATION WEBSOCKET LISTENERS
  // =====================================================

  useEffect(() => {

    console.log(
      '========== FRONTEND ADMIN: RESERVATION WEBSOCKET LISTENERS START =========='
    )

    // ===================================================
    // FRONTEND WEBSOCKET: RESERVATION CREATED
    // ===================================================

    console.log(
      'Frontend admin: listening for reservation:created events...'
    )

    const handleReservationCreated = (reservation) => {

      console.log(
        '%c🚨 WEBSOCKET: RESERVATION CREATED 🚨',
        'color: red; font-weight: bold; font-size: 16px;'
      )

      console.log(
        'New reservation received by reservations hook:',
        reservation
      )

      console.log(
        'Reservation ID received:',
        reservation.id
      )

      console.log(
        'Updating React Query reservation cache...'
      )

      queryClient.setQueryData(
        ['admin', 'reservations'],
        (currentReservations) => {

          console.log(
            'Current React Query reservation cache:',
            currentReservations
          )

          // =================================================
          // FRONTEND WEBSOCKET: DUPLICATE PROTECTION
          // =================================================

          if (
            currentReservations?.some(
              (existingReservation) =>
                existingReservation.id === reservation.id
            )
          ) {

            console.log(
              'Reservation already exists in cache. Skipping duplicate.'
            )

            return currentReservations
          }

          // =================================================
          // FRONTEND WEBSOCKET: ADD NEW RESERVATION
          // =================================================

          console.log(
            'New reservation not found in cache.'
          )

          console.log(
            'Adding reservation to the beginning of the cache...'
          )

          return [
            reservation,
            ...(currentReservations ?? []),
          ]
        }
      )

      console.log(
        'React Query reservation cache update completed'
      )
    }

    adminSocket.on(
      'reservation:created',
      handleReservationCreated
    )

    console.log(
      'Frontend admin: reservation:created listener registered'
    )

    // ===================================================
    // FRONTEND WEBSOCKET: RESERVATION STATUS UPDATED
    // ===================================================

    console.log(
      'Frontend admin: listening for reservation:statusUpdated events...'
    )

    const handleReservationStatusUpdated = (updatedReservation) => {

      console.log(
        '%c🚨 WEBSOCKET: RESERVATION STATUS UPDATED 🚨',
        'color: red; font-weight: bold; font-size: 16px;'
      )

      console.log(
        'Updated reservation received:',
        updatedReservation
      )

      console.log(
        'Reservation ID:',
        updatedReservation.id
      )

      console.log(
        'New reservation status:',
        updatedReservation.status
      )

      console.log(
        'Updating React Query reservation cache...'
      )

      queryClient.setQueryData(
        ['admin', 'reservations'],
        (currentReservations) => {

          console.log(
            'Current React Query reservation cache:',
            currentReservations
          )

          if (!currentReservations) {

            console.log(
              'No reservation cache exists yet.'
            )

            return currentReservations
          }

          const updatedReservations =
            currentReservations.map(
              (reservation) => {

                if (
                  reservation.id !== updatedReservation.id
                ) {

                  return reservation
                }

                console.log(
                  'Matching reservation found in cache:',
                  reservation.id
                )

                console.log(
                  'Old status:',
                  reservation.status
                )

                console.log(
                  'New status:',
                  updatedReservation.status
                )

                return {
                  ...reservation,
                  status: updatedReservation.status,
                }
              }
            )

          console.log(
            'Reservation cache updated successfully'
          )

          return updatedReservations
        }
      )

      console.log(
        'React Query reservation status update completed'
      )
    }

    adminSocket.on(
      'reservation:statusUpdated',
      handleReservationStatusUpdated
    )

    console.log(
      'Frontend admin: reservation:statusUpdated listener registered'
    )

    // ===================================================
    // FRONTEND WEBSOCKET: RESERVATION CANCELLED
    // ===================================================

    console.log(
      'Frontend admin: listening for reservation:cancelled events...'
    )

    const handleReservationCancelled = (cancelledReservation) => {

      console.log(
        '%c🚨 WEBSOCKET: RESERVATION CANCELLED 🚨',
        'color: red; font-weight: bold; font-size: 16px;'
      )

      console.log(
        'Cancelled reservation received:',
        cancelledReservation
      )

      console.log(
        'Cancelled reservation ID:',
        cancelledReservation.id
      )

      console.log(
        'Removing reservation from React Query cache...'
      )

      queryClient.setQueryData(
        ['admin', 'reservations'],
        (currentReservations) => {

          console.log(
            'Current React Query reservation cache:',
            currentReservations
          )

          if (!currentReservations) {

            console.log(
              'No reservation cache exists yet.'
            )

            return currentReservations
          }

          // =================================================
          // FRONTEND WEBSOCKET: REMOVE CANCELLED RESERVATION
          // =================================================

          const filteredReservations =
            currentReservations.filter(
              (reservation) => {

                const isCancelled =
                  reservation.id === cancelledReservation.id

                if (isCancelled) {

                  console.log(
                    'Cancelled reservation found in cache:',
                    reservation.id
                  )

                  console.log(
                    'Removing reservation from cache...'
                  )
                }

                return !isCancelled
              }
            )

          console.log(
            'Reservation cache after cancellation:',
            filteredReservations
          )

          console.log(
            'Reservation removed from React Query cache successfully'
          )

          return filteredReservations
        }
      )

      console.log(
        'React Query reservation cancellation update completed'
      )
    }

    adminSocket.on(
      'reservation:cancelled',
      handleReservationCancelled
    )

    console.log(
      'Frontend admin: reservation:cancelled listener registered'
    )

    // ===================================================
    // FRONTEND WEBSOCKET: RESERVATION EXPIRED
    // ===================================================

    console.log(
      'Frontend admin: listening for reservation:expired events...'
    )

    const handleReservationExpired = (expiredReservation) => {

      console.log(
        '%c🚨 WEBSOCKET: RESERVATION EXPIRED 🚨',
        'color: red; font-weight: bold; font-size: 16px;'
      )

      console.log(
        'Expired reservation received:',
        expiredReservation
      )

      console.log(
        'Expired reservation ID:',
        expiredReservation.id
      )

      console.log(
        'Removing expired reservation from React Query cache...'
      )

      queryClient.setQueryData(
        ['admin', 'reservations'],
        (currentReservations) => {

          console.log(
            'Current React Query reservation cache:',
            currentReservations
          )

          if (!currentReservations) {

            console.log(
              'No reservation cache exists yet.'
            )

            return currentReservations
          }

          const filteredReservations =
            currentReservations.filter(
              (reservation) => {

                const isExpired =
                  reservation.id === expiredReservation.id

                if (isExpired) {

                  console.log(
                    'Expired reservation found in cache:',
                    reservation.id
                  )

                  console.log(
                    'Removing expired reservation from cache...'
                  )
                }

                return !isExpired
              }
            )

          console.log(
            'Reservation cache after expiration:',
            filteredReservations
          )

          console.log(
            'Expired reservation removed from React Query cache successfully'
          )

          return filteredReservations
        }
      )

      console.log(
        'React Query reservation expiration update completed'
      )
    }

    adminSocket.on(
      'reservation:expired',
      handleReservationExpired
    )

    console.log(
      'Frontend admin: reservation:expired listener registered'
    )

    // ===================================================
    // FRONTEND WEBSOCKET: RESERVATION COMPLETED
    // ===================================================

    console.log(
      'Frontend admin: listening for reservation:completed events...'
    )

    const handleReservationCompleted = (completedReservation) => {

      console.log(
        '%c🚨 WEBSOCKET: RESERVATION COMPLETED 🚨',
        'color: green; font-weight: bold; font-size: 16px;'
      )

      console.log(
        'Completed reservation received:',
        completedReservation
      )

      console.log(
        'Completed reservation ID:',
        completedReservation.id
      )

      console.log(
        'Invalidating React Query reservation cache...'
      )

      // ! The backend has already changed the reservation
      // ! status to COMPLETED.
      //
      // ? We invalidate the query instead of directly removing
      // ? the reservation because COMPLETED reservations remain
      // ? visible for 24 hours after checkout.
      //
      // ? The backend decides whether the reservation should
      // ? remain visible.

      queryClient.invalidateQueries({
        queryKey: [
          'admin',
          'reservations',
        ],
      })

      console.log(
        'React Query reservation cache invalidated successfully'
      )
    }

    adminSocket.on(
      'reservation:completed',
      handleReservationCompleted
    )

    console.log(
      'Frontend admin: reservation:completed listener registered'
    )

    // =====================================================
    // FRONTEND ADMIN: WEBSOCKET LISTENER CLEANUP
    // =====================================================

    return () => {

      console.log(
        '========== FRONTEND ADMIN: RESERVATION WEBSOCKET CLEANUP =========='
      )

      // ===================================================
      // REMOVE RESERVATION CREATED LISTENER
      // ===================================================

      console.log(
        'Frontend admin: removing reservation:created listener...'
      )

      adminSocket.off(
        'reservation:created',
        handleReservationCreated
      )

      console.log(
        'Frontend admin: reservation:created listener removed'
      )

      // ===================================================
      // REMOVE RESERVATION STATUS UPDATED LISTENER
      // ===================================================

      console.log(
        'Frontend admin: removing reservation:statusUpdated listener...'
      )

      adminSocket.off(
        'reservation:statusUpdated',
        handleReservationStatusUpdated
      )

      console.log(
        'Frontend admin: reservation:statusUpdated listener removed'
      )

      // ===================================================
      // REMOVE RESERVATION CANCELLED LISTENER
      // ===================================================

      console.log(
        'Frontend admin: removing reservation:cancelled listener...'
      )

      adminSocket.off(
        'reservation:cancelled',
        handleReservationCancelled
      )

      console.log(
        'Frontend admin: reservation:cancelled listener removed'
      )

      // ===================================================
      // REMOVE RESERVATION EXPIRED LISTENER
      // ===================================================

      console.log(
        'Frontend admin: removing reservation:expired listener...'
      )

      adminSocket.off(
        'reservation:expired',
        handleReservationExpired
      )

      console.log(
        'Frontend admin: reservation:expired listener removed'
      )

      // ===================================================
      // REMOVE RESERVATION COMPLETED LISTENER
      // ===================================================

      console.log(
        'Frontend admin: removing reservation:completed listener...'
      )

      adminSocket.off(
        'reservation:completed',
        handleReservationCompleted
      )

      console.log(
        'Frontend admin: reservation:completed listener removed'
      )

      console.log(
        '========== FRONTEND ADMIN: RESERVATION WEBSOCKET CLEANUP COMPLETE =========='
      )
    }

  }, [queryClient])

  // =====================================================
  // FRONTEND ADMIN: RESERVATIONS QUERY LOGGING
  // =====================================================

  console.log(
    '========== FRONTEND ADMIN: RESERVATIONS QUERY =========='
  )

  console.log(
    'Admin reservations loading:',
    query.isLoading
  )

  console.log(
    'Admin reservations fetching:',
    query.isFetching
  )

  console.log(
    'Admin reservations data:',
    query.data
  )

  console.log(
    'Admin reservations error:',
    query.error
  )

  console.log(
    '========== FRONTEND ADMIN: RESERVATIONS QUERY END =========='
  )

  return query
}

export default useAdminReservations
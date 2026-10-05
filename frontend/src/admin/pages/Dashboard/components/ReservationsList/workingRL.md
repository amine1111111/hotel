import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Mail,
  Phone,
} from 'lucide-react'

import { Button } from '../../../../../components/ui/button'

import {
  Card,
  CardContent,
} from '../../../../../components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select'

import useUpdateAdminReservationStatus from '../../../../hooks/useUpdateAdminReservationStatus'

// =====================================================
// FRONTEND ADMIN: RESERVATION STATUS STYLES
// =====================================================

// ! Booking status and stay stage are separate concepts.
//
// ? These styles are only for the DATABASE booking status.
//
// ? PENDING:
// ? The hotel still needs to confirm the reservation.
//
// ? CONFIRMED:
// ? The hotel has confirmed the reservation.

const statusStyles = {

  PENDING:
    'border-amber-200 bg-amber-50 text-amber-700',

  CONFIRMED:
    'border-emerald-200 bg-emerald-50 text-emerald-700',

  CANCELLED:
    'border-red-200 bg-red-50 text-red-700',

  COMPLETED:
    'border-stone-200 bg-stone-100 text-stone-600',
}

// =====================================================
// FRONTEND ADMIN: STAY STAGE STYLES
// =====================================================

// ! Stay stage describes where the guest currently is
// ! in the reservation lifecycle.
//
// ? This is intentionally separate from booking status.

const stayStageStyles = {

  PENDING:
    'border-amber-200 bg-amber-50 text-amber-700',

  CONFIRMED:
    'border-stone-200 bg-stone-100 text-stone-600',

  UPCOMING:
    'border-blue-200 bg-blue-50 text-blue-700',

  OCCUPIED:
    'border-violet-200 bg-violet-50 text-violet-700',

  CHECKED_OUT:
    'border-stone-200 bg-stone-100 text-stone-500',
}

// =====================================================
// FRONTEND ADMIN: STAY STAGE LABELS
// =====================================================

// ! Convert internal database-style values into labels
// ! that are easier for hotel staff to read.

const stayStageLabels = {

  PENDING:
    'Pending',

  CONFIRMED:
    'Confirmed',

  UPCOMING:
    'Upcoming',

  OCCUPIED:
    'Occupied',

  CHECKED_OUT:
    'Checked-out',
}

// =====================================================
// FRONTEND ADMIN: DATE FORMATTING
// =====================================================

const formatDate = (date) => {

  if (!date) {
    return '—'
  }

  return new Date(date).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )
}

// =====================================================
// FRONTEND ADMIN: PRICE FORMATTING
// =====================================================

const formatPrice = (price) => {

  if (typeof price !== 'number') {
    return '—'
  }

  return `${price.toLocaleString('en-DZ')} DA`
}

// =====================================================
// FRONTEND ADMIN: RESERVATION STAY STAGE
// =====================================================

// ! Important concept
// Booking status and stay stage are different concepts.
//
// Booking status answers:
// "Has the hotel confirmed this reservation?"
//
// Stay stage answers:
// "Where is this guest in their stay?"
//
// Booking status:
// PENDING / CONFIRMED
//
// Stay stage:
// PENDING / CONFIRMED / UPCOMING / OCCUPIED / CHECKED-OUT

const getStayStage = (
  reservation,
  currentTime
) => {

  // ! Use the shared currentTime from the component.
  //
  // ? Every reservation therefore uses exactly the same
  // ? point in time during a render.

  const now =
    currentTime

  const checkIn =
    new Date(
      reservation.checkIn
    )

  const checkOut =
    new Date(
      reservation.checkOut
    )

  console.log(
    'Calculating stay stage:',
    {
      reservationId:
        reservation.id,

      now,

      checkIn,

      checkOut,

      bookingStatus:
        reservation.status,
    }
  )

  // ! Pending reservations always remain in
  // ! the PENDING stage.

  if (
    reservation.status ===
    'PENDING'
  ) {

    console.log(
      'Reservation is PENDING'
    )

    return 'PENDING'
  }

  // ! If the current time is at or after checkout,
  // ! the guest has already left.

  if (
    now >= checkOut
  ) {

    console.log(
      'Reservation stay stage: CHECKED-OUT'
    )

    return 'CHECKED_OUT'
  }

  // ! If the current time is between check-in
  // ! and checkout, the guest is currently staying.

  if (
    now >= checkIn &&
    now < checkOut
  ) {

    console.log(
      'Reservation stay stage: OCCUPIED'
    )

    return 'OCCUPIED'
  }

  // ! Calculate how many hours remain before
  // ! the customer's check-in time.

  const millisecondsUntilCheckIn =
    checkIn.getTime() -
    now.getTime()

  const hoursUntilCheckIn =
    millisecondsUntilCheckIn /
    (1000 * 60 * 60)

  console.log(
    'Hours until check-in:',
    hoursUntilCheckIn
  )

  // ! A confirmed reservation becomes UPCOMING
  // ! during the 24 hours immediately before check-in.

  if (
    reservation.status ===
      'CONFIRMED' &&
    hoursUntilCheckIn > 0 &&
    hoursUntilCheckIn <= 24
  ) {

    console.log(
      'Reservation stay stage: UPCOMING'
    )

    return 'UPCOMING'
  }

  // ! The reservation is confirmed but is
  // ! more than 24 hours before check-in.

  console.log(
    'Reservation stay stage: CONFIRMED'
  )

  return 'CONFIRMED'
}

// =====================================================
// FRONTEND ADMIN: RESERVATIONS LIST
// =====================================================

const ReservationsList = ({
  reservations,
}) => {

  const {
    mutate: updateStatus,
    isPending,
  } =
    useUpdateAdminReservationStatus()

  const [
    updatingReservationId,
    setUpdatingReservationId,
  ] = useState(null)

  const [search, setSearch] =
    useState('')

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('ALL')

  // =====================================================
  // FRONTEND ADMIN: AUTOMATIC STAY-STAGE CLOCK
  // =====================================================

  // ! Stay stages depend on the current time.
  //
  // ? React does not automatically re-render just because
  // ? the system clock changes.
  //
  // ? This state gives React a value that changes over time.
  // ? When it changes, the component re-renders and all
  // ? reservation stay stages are calculated again.

  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    new Date()
  )

  useEffect(() => {

    console.log(
      '========== FRONTEND ADMIN: STAY STAGE TIMER START =========='
    )

    console.log(
      'Starting automatic stay-stage refresh...'
    )

    // ! Refresh the current time once every minute.
    //
    // ? This is only a local React state update.
    //
    // ? It does NOT:
    // ? - call the backend
    // ? - query the database
    // ? - send a WebSocket event
    // ?
    // ? It simply causes React to recalculate
    // ? the reservation stay stages.

    const intervalId =
      setInterval(() => {

        const newTime =
          new Date()

        console.log(
          'Stay-stage timer tick:',
          newTime
        )

        setCurrentTime(
          newTime
        )

      }, 60 * 1000)

    // ! Clean up the interval when the component
    // ! is removed from the page.
    //
    // ? This prevents an old timer from continuing
    // ? to run after the component is unmounted.

    return () => {

      console.log(
        '========== FRONTEND ADMIN: STAY STAGE TIMER CLEANUP =========='
      )

      console.log(
        'Stopping automatic stay-stage refresh...'
      )

      clearInterval(
        intervalId
      )

      console.log(
        'Stay-stage timer stopped'
      )
    }

  }, [])

  console.log(
    '========== FRONTEND ADMIN: RESERVATION LIST =========='
  )

  console.log(
    'Reservations received:',
    reservations
  )

  console.log(
    'Reservation count:',
    reservations?.length ?? 0
  )

  console.log(
    'Current shared reservation time:',
    currentTime
  )

  // =====================================================
  // FRONTEND ADMIN: RESERVATION COUNTS
  // =====================================================

  const reservationCounts =
    useMemo(() => {

      console.log(
        '========== FRONTEND ADMIN: CALCULATING RESERVATION COUNTS =========='
      )

      const counts = {

        ALL:
          reservations?.length ?? 0,

        PENDING: 0,

        CONFIRMED: 0,

        UPCOMING: 0,

        OCCUPIED: 0,

        CHECKED_OUT: 0,
      }

      reservations?.forEach(
        (reservation) => {

          // ! Pending reservations are counted
          // ! separately from confirmed stay stages.

          if (
            reservation.status ===
            'PENDING'
          ) {

            counts.PENDING += 1

            return
          }

          const stayStage =
            getStayStage(
              reservation,
              currentTime
            )

          if (
            stayStage ===
            'CONFIRMED'
          ) {

            counts.CONFIRMED += 1
          }

          if (
            stayStage ===
            'UPCOMING'
          ) {

            counts.UPCOMING += 1
          }

          if (
            stayStage ===
            'OCCUPIED'
          ) {

            counts.OCCUPIED += 1
          }

          if (
            stayStage ===
            'CHECKED_OUT'
          ) {

            counts.CHECKED_OUT += 1
          }
        }
      )

      console.log(
        'Reservation counts calculated:',
        counts
      )

      console.log(
        '========== FRONTEND ADMIN: RESERVATION COUNTS COMPLETE =========='
      )

      return counts

    }, [
      reservations,
      currentTime,
    ])

  // =====================================================
  // FRONTEND ADMIN: FILTER RESERVATIONS
  // =====================================================

  const filteredReservations =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLowerCase()

      console.log(
        '========== FRONTEND ADMIN: FILTERING RESERVATIONS =========='
      )

      console.log(
        'Search:',
        normalizedSearch
      )

      console.log(
        'Reservation filter:',
        statusFilter
      )

      const filtered =
        reservations?.filter(
          (reservation) => {

            const stayStage =
              getStayStage(
                reservation,
                currentTime
              )

            console.log(
              'Reservation stay stage:',
              {
                id:
                  reservation.id,

                status:
                  reservation.status,

                stayStage,
              }
            )

            let matchesFilter =
              true

            // =================================================
            // PENDING FILTER
            // =================================================

            if (
              statusFilter ===
              'PENDING'
            ) {

              matchesFilter =
                reservation.status ===
                'PENDING'
            }

            // =================================================
            // CONFIRMED FILTER
            // =================================================

            if (
              statusFilter ===
              'CONFIRMED'
            ) {

              matchesFilter =
                stayStage ===
                'CONFIRMED'
            }

            // =================================================
            // UPCOMING FILTER
            // =================================================

            if (
              statusFilter ===
              'UPCOMING'
            ) {

              matchesFilter =
                stayStage ===
                'UPCOMING'
            }

            // =================================================
            // OCCUPIED FILTER
            // =================================================

            if (
              statusFilter ===
              'OCCUPIED'
            ) {

              matchesFilter =
                stayStage ===
                'OCCUPIED'
            }

            // =================================================
            // CHECKED-OUT FILTER
            // =================================================

            if (
              statusFilter ===
              'CHECKED_OUT'
            ) {

              matchesFilter =
                stayStage ===
                'CHECKED_OUT'
            }

            console.log(
              'Reservation filter result:',
              {
                id:
                  reservation.id,

                status:
                  reservation.status,

                stayStage,

                matchesFilter,
              }
            )

            // ! First apply the selected stay/status filter.

            if (!matchesFilter) {
              return false
            }

            // ! If there is no search,
            // ! the reservation already matches.

            if (!normalizedSearch) {
              return true
            }

            // =================================================
            // FRONTEND ADMIN: SEARCHABLE VALUES
            // =================================================

            const room =
              reservation.physicalRoom

            const roomType =
              room?.roomType

            const searchableValues = [

              reservation.id,

              reservation.guestName,

              reservation.guestEmail,

              reservation.guestPhone,

              room?.roomNumber,

              roomType?.name,
            ]

            const matchesSearch =
              searchableValues.some(
                (value) =>
                  String(
                    value ?? ''
                  )
                    .toLowerCase()
                    .includes(
                      normalizedSearch
                    )
              )

            console.log(
              'Reservation search result:',
              {
                id:
                  reservation.id,

                matchesSearch,
              }
            )

            return matchesSearch
          }
        ) ?? []

      console.log(
        'Filtered reservations:',
        filtered
      )

      console.log(
        'Filtered reservation count:',
        filtered.length
      )

      console.log(
        '========== FRONTEND ADMIN: FILTERING COMPLETE =========='
      )

      return filtered

    }, [
      reservations,
      search,
      statusFilter,
      currentTime,
    ])

  // =====================================================
  // FRONTEND ADMIN: UPDATE RESERVATION STATUS
  // =====================================================

  const handleStatusUpdate = (
    reservationId,
    status
  ) => {

    console.log(
      '========== FRONTEND ADMIN: STATUS BUTTON CLICK =========='
    )

    console.log(
      'Reservation ID:',
      reservationId
    )

    console.log(
      'Requested status:',
      status
    )

    setUpdatingReservationId(
      reservationId
    )

    console.log(
      'Updating reservation ID:',
      reservationId
    )

    updateStatus(
      {
        reservationId,
        status,
      },
      {
        onSettled: () => {

          console.log(
            '========== FRONTEND ADMIN: STATUS BUTTON SETTLED =========='
          )

          console.log(
            'Clearing updating reservation ID'
          )

          setUpdatingReservationId(
            null
          )
        },
      }
    )
  }

  // =====================================================
  // FRONTEND ADMIN: EMPTY RESERVATION STATE
  // =====================================================

  if (!reservations?.length) {

    console.log(
      'No reservations to display'
    )

    return (
      <Card className="border-stone-200 bg-white">

        <CardContent className="flex min-h-48 items-center justify-center p-8">

          <div className="text-center">

            <p className="text-sm font-medium text-stone-700">
              No reservations found
            </p>

            <p className="mt-1 text-sm text-stone-500">
              Reservations will appear here when guests make a booking.
            </p>

          </div>

        </CardContent>

      </Card>
    )
  }

  // =====================================================
  // FRONTEND ADMIN: RESERVATION UI
  // =====================================================

  return (
    <div>

      {/* =====================================================
          FRONTEND ADMIN: SEARCH + RESERVATION FILTER
          ===================================================== */}

      <div className="mb-5 flex gap-3">

        {/* =================================================
            SEARCH
            ================================================= */}

        <div className="flex-1">

          <input
            type="search"
            value={search}
            onChange={(event) => {

              const value =
                event.target.value

              console.log(
                'Reservation search changed:',
                value
              )

              setSearch(value)
            }}
            placeholder="Search reservations..."
            className="
              w-full
              rounded-xl
              border
              border-stone-200
              bg-white
              px-4
              py-3
              text-sm
              text-stone-900
              outline-none
              transition
              placeholder:text-stone-400
              focus:border-stone-400
              focus:ring-2
              focus:ring-stone-200
            "
          />

        </div>

        {/* =================================================
            RESERVATION FILTER
            ================================================= */}

        <div className="w-52">

          <Select
            value={statusFilter}
            onValueChange={(value) => {

              console.log(
                'Reservation filter changed:',
                value
              )

              setStatusFilter(value)
            }}
          >

            <SelectTrigger
              className="
                h-full
                w-full
                rounded-xl
                border-stone-200
                bg-white
                px-4
                py-3
                text-sm
                text-stone-700
                shadow-none
                focus:ring-2
                focus:ring-stone-200
              "
            >

              <SelectValue />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="ALL">
                All reservations ({reservationCounts.ALL})
              </SelectItem>

              <SelectItem value="PENDING">
                Pending ({reservationCounts.PENDING})
              </SelectItem>

              <SelectItem value="CONFIRMED">
                Confirmed ({reservationCounts.CONFIRMED})
              </SelectItem>

              <SelectItem value="UPCOMING">
                Upcoming ({reservationCounts.UPCOMING})
              </SelectItem>

              <SelectItem value="OCCUPIED">
                Occupied ({reservationCounts.OCCUPIED})
              </SelectItem>

              <SelectItem value="CHECKED_OUT">
                Checked-out ({reservationCounts.CHECKED_OUT})
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

      </div>

      {/* =====================================================
          FRONTEND ADMIN: RESERVATION CARDS
          ===================================================== */}

      <div className="space-y-4">

        {filteredReservations.length === 0 ? (

          <Card className="border-stone-200 bg-white">

            <CardContent className="flex min-h-48 items-center justify-center p-8">

              <div className="text-center">

                <p className="text-sm font-medium text-stone-700">
                  No matching reservations
                </p>

                <p className="mt-1 text-sm text-stone-500">
                  Try changing the search or reservation filter.
                </p>

              </div>

            </CardContent>

          </Card>

        ) : (

          filteredReservations.map(
            (reservation) => {

              const room =
                reservation.physicalRoom

              const roomType =
                room?.roomType

              const stayStage =
                getStayStage(
                  reservation,
                  currentTime
                )

              const statusClass =
                statusStyles[
                  reservation.status
                ] ??
                'border-stone-200 bg-stone-100 text-stone-600'

              const stayStageClass =
                stayStageStyles[
                  stayStage
                ] ??
                'border-stone-200 bg-stone-100 text-stone-600'

              const stayStageLabel =
                stayStageLabels[
                  stayStage
                ] ??
                stayStage.replace(
                  '_',
                  '-'
                )

              return (

                <Card
                  key={
                    reservation.id
                  }
                  className="
                    overflow-hidden
                    border-stone-200
                    bg-white
                    shadow-sm
                    transition-shadow
                    hover:shadow-md
                  "
                >

                  <CardContent className="p-0">

                    {/* =========================================
                        RESERVATION HEADER
                        ========================================= */}

                    <div className="border-b border-stone-100 px-6 py-5">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">

                          <div className="flex items-center gap-3">

                            <h3 className="truncate text-base font-semibold text-stone-900">
                              {reservation.guestName}
                            </h3>

                            <span
                              className={`
                                inline-flex
                                shrink-0
                                items-center
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                ${statusClass}
                              `}
                            >
                              {reservation.status}
                            </span>

                          </div>

                          {/* =====================================
                              RESERVATION ID
                              ===================================== */}

                          <p className="mt-1 text-xs text-stone-400">
                            Reservation #{reservation.id}
                          </p>

                          {/* =====================================
                              CONTACT INFORMATION
                              ===================================== */}

                          <div className="mt-4 flex flex-col gap-2 text-sm text-stone-500 sm:flex-row sm:flex-wrap sm:gap-x-5">

                            <div className="flex min-w-0 items-center gap-2">

                              <Mail className="h-4 w-4 shrink-0 text-stone-400" />

                              <span className="truncate">
                                {reservation.guestEmail}
                              </span>

                            </div>

                            <div className="flex items-center gap-2">

                              <Phone className="h-4 w-4 shrink-0 text-stone-400" />

                              <span>
                                {reservation.guestPhone}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* =========================================
                        RESERVATION DETAILS
                        ========================================= */}

                    <div className="grid gap-px border-b border-stone-100 bg-stone-100 sm:grid-cols-2 lg:grid-cols-4">

                      {/* =======================================
                          ROOM
                          ======================================= */}

                      <div className="bg-white px-6 py-5">

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Room
                        </p>

                        <p className="mt-2 text-sm font-semibold text-stone-800">
                          {roomType?.name ?? '—'}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          Room {room?.roomNumber ?? '—'}
                        </p>

                      </div>

                      {/* =======================================
                          STAY
                          ======================================= */}

                      <div className="bg-white px-6 py-5">

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Stay
                        </p>

                        <div className="mt-2">

                          <p className="text-sm font-semibold text-stone-800">
                            {formatDate(
                              reservation.checkIn
                            )}
                          </p>

                          <p className="mt-1 text-xs text-stone-500">
                            Check-in
                          </p>

                        </div>

                        <div className="mt-2">

                          <p className="text-sm font-medium text-stone-600">
                            {formatDate(
                              reservation.checkOut
                            )}
                          </p>

                          <p className="mt-1 text-xs text-stone-500">
                            Check-out
                          </p>

                        </div>

                      </div>

                      {/* =======================================
                          GUESTS
                          ======================================= */}

                      <div className="bg-white px-6 py-5">

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Guests
                        </p>

                        <p className="mt-2 text-sm font-semibold text-stone-800">

                          {reservation.adults}{' '}

                          adult
                          {reservation.adults !== 1
                            ? 's'
                            : ''}

                        </p>

                        <p className="mt-1 text-xs text-stone-500">

                          {reservation.children}{' '}

                          children

                        </p>

                      </div>

                      {/* =======================================
                          PRICE
                          ======================================= */}

                      <div className="bg-white px-6 py-5">

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Total
                        </p>

                        <p className="mt-2 text-base font-semibold text-stone-900">
                          {formatPrice(
                            reservation.totalPrice
                          )}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {formatPrice(
                            reservation.pricePerNight
                          )}
                          /night
                        </p>

                      </div>

                    </div>

                    {/* =========================================
                        STAY STAGE + ACTIONS
                        ========================================= */}

                    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                      {/* =====================================
                          STAY STAGE
                          ===================================== */}

                      <div className="flex items-center gap-3">

                        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Stay stage
                        </span>

                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            ${stayStageClass}
                          `}
                        >
                          {stayStageLabel}
                        </span>

                      </div>

                      {/* =====================================
                          RESERVATION ACTIONS
                          ===================================== */}

                      {reservation.status ===
                        'PENDING' && (

                        <div className="flex gap-2">

                          <Button
                            type="button"
                            disabled={
                              isPending &&
                              updatingReservationId ===
                                reservation.id
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                reservation.id,
                                'CONFIRMED'
                              )
                            }
                            className="rounded-lg px-4"
                          >

                            {isPending &&
                            updatingReservationId ===
                              reservation.id
                              ? 'Confirming...'
                              : 'Confirm'}

                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            disabled={
                              isPending &&
                              updatingReservationId ===
                                reservation.id
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                reservation.id,
                                'CANCELLED'
                              )
                            }
                            className="rounded-lg px-4"
                          >

                            {isPending &&
                            updatingReservationId ===
                              reservation.id
                              ? 'Updating...'
                              : 'Cancel'}

                          </Button>

                        </div>

                      )}

                    </div>

                  </CardContent>

                </Card>

              )
            }
          )

        )}

      </div>

    </div>
  )
}

export default ReservationsList
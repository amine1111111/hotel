import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
  Users,
  X,
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

// ! Booking status and stay stage are different concepts.
//
// ? Booking status:
// ? PENDING / CONFIRMED
//
// ? Stay stage:
// ? PENDING / CONFIRMED / UPCOMING / OCCUPIED / CHECKED_OUT

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
// ! in their reservation lifecycle.
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
// FRONTEND ADMIN: NIGHT CALCULATION
// =====================================================

// ! Reservations store check-in and check-out as DateTime
// ! values.
//
// ? The difference between the two dates gives us the
// ? number of nights in the reservation.
//
// ? This is only used for displaying information in the
// ? frontend admin card.

const getNumberOfNights = (
  checkIn,
  checkOut
) => {

  if (!checkIn || !checkOut) {
    return 0
  }

  const start =
    new Date(checkIn)

  const end =
    new Date(checkOut)

  const millisecondsPerDay =
    1000 *
    60 *
    60 *
    24

  const nights =
    Math.ceil(
      (
        end.getTime() -
        start.getTime()
      ) /
      millisecondsPerDay
    )

  console.log(
    'Calculated reservation nights:',
    {
      checkIn,
      checkOut,
      nights,
    }
  )

  return nights
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
    // ? This only updates local React state.
    //
    // ? It does NOT:
    // ? - call the backend
    // ? - query the database
    // ? - send a WebSocket event
    //
    // ? It simply causes the stay stages to be
    // ? recalculated.

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
      <Card className="border-stone-200 bg-white shadow-sm">

        <CardContent className="flex min-h-56 items-center justify-center p-8">

          <div className="max-w-sm text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">

              <CalendarDays className="h-5 w-5 text-stone-400" />

            </div>

            <p className="mt-4 text-sm font-semibold text-stone-800">
              No reservations yet
            </p>

            <p className="mt-1 text-sm leading-6 text-stone-500">
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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">

        {/* =================================================
            SEARCH
            ================================================= */}

        <div className="relative flex-1">

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
            placeholder="Search by guest, email, phone, room..."
            className="
              h-12
              w-full
              rounded-xl
              border
              border-stone-200
              bg-white
              px-4
              text-sm
              text-stone-900
              shadow-sm
              outline-none
              transition
              placeholder:text-stone-400
              hover:border-stone-300
              focus:border-stone-400
              focus:ring-2
              focus:ring-stone-200
            "
          />

        </div>

        {/* =================================================
            RESERVATION FILTER
            ================================================= */}

        <div className="w-full sm:w-56">
  <Select
    value={statusFilter}
    onValueChange={(value) => {
      setStatusFilter(value)
    }}
  >
    <SelectTrigger
      className="
        h-12
        w-full
        rounded-xl
        border-[#b89b72]/30
        bg-white
        px-4
        text-sm
        text-[#2c2420]
        shadow-sm
        focus:ring-2
        focus:ring-[#b89b72]/20
      "
    >
      <SelectValue />
    </SelectTrigger>

    <SelectContent
      className="
        border-[#b89b72]/20
        bg-white
        text-[#2c2420]
      "
    >
      <SelectItem
        value="ALL"
        className="
          text-[#2c2420]
          focus:bg-[#f4eee7]
          focus:text-[#2c2420]
        "
      >
        All reservations ({reservationCounts.ALL})
      </SelectItem>

      <SelectItem
        value="PENDING"
        className="
          text-[#2c2420]
          focus:bg-[#f4eee7]
          focus:text-[#2c2420]
        "
      >
        Pending ({reservationCounts.PENDING})
      </SelectItem>

      <SelectItem
        value="CONFIRMED"
        className="
          text-[#2c2420]
          focus:bg-[#f4eee7]
          focus:text-[#2c2420]
        "
      >
        Confirmed ({reservationCounts.CONFIRMED})
      </SelectItem>

      <SelectItem
        value="UPCOMING"
        className="
          text-[#2c2420]
          focus:bg-[#f4eee7]
          focus:text-[#2c2420]
        "
      >
        Upcoming ({reservationCounts.UPCOMING})
      </SelectItem>

      <SelectItem
        value="OCCUPIED"
        className="
          text-[#2c2420]
          focus:bg-[#f4eee7]
          focus:text-[#2c2420]
        "
      >
        Occupied ({reservationCounts.OCCUPIED})
      </SelectItem>

      <SelectItem
        value="CHECKED_OUT"
        className="
          text-[#2c2420]
          focus:bg-[#f4eee7]
          focus:text-[#2c2420]
        "
      >
        Checked-out ({reservationCounts.CHECKED_OUT})
      </SelectItem>
    </SelectContent>
  </Select>
</div>

      </div>

      {/* =====================================================
          FRONTEND ADMIN: RESERVATION RESULTS SUMMARY
          ===================================================== */}

      <div className="mb-4 flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold text-stone-800">
            Reservations
          </p>

          <p className="mt-0.5 text-xs text-stone-500">
            Showing {filteredReservations.length} of{' '}
            {reservations.length}
          </p>

        </div>

        {search || statusFilter !== 'ALL' ? (

          <button
            type="button"
            onClick={() => {

              console.log(
                'Clearing reservation search and filter...'
              )

              setSearch('')
              setStatusFilter('ALL')

            }}
            className="
              text-xs
              font-medium
              text-stone-500
              transition
              hover:text-stone-900
            "
          >
            Clear filters
          </button>

        ) : null}

      </div>

      {/* =====================================================
          FRONTEND ADMIN: RESERVATION CARDS
          ===================================================== */}

      <div className="space-y-4">

        {filteredReservations.length === 0 ? (

          <Card className="border-stone-200 bg-white shadow-sm">

            <CardContent className="flex min-h-56 items-center justify-center p-8">

              <div className="max-w-sm text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">

                  <CalendarDays className="h-5 w-5 text-stone-400" />

                </div>

                <p className="mt-4 text-sm font-semibold text-stone-800">
                  No matching reservations
                </p>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Try changing your search or reservation filter.
                </p>

                <button
                  type="button"
                  onClick={() => {

                    console.log(
                      'Resetting reservation filters...'
                    )

                    setSearch('')
                    setStatusFilter('ALL')

                  }}
                  className="
                    mt-4
                    text-sm
                    font-medium
                    text-stone-700
                    underline
                    underline-offset-4
                    transition
                    hover:text-stone-950
                  "
                >
                  Clear filters
                </button>

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

              const nights =
                getNumberOfNights(
                  reservation.checkIn,
                  reservation.checkOut
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

              console.log(
                '========== FRONTEND ADMIN: RENDERING RESERVATION CARD =========='
              )

              console.log(
                'Reservation card data:',
                {
                  id:
                    reservation.id,

                  guestName:
                    reservation.guestName,

                  status:
                    reservation.status,

                  stayStage,

                  room:
                    roomType?.name,

                  roomNumber:
                    room?.roomNumber,

                  nights,

                  totalPrice:
                    reservation.totalPrice,
                }
              )

              return (
  <Card
    key={reservation.id}
    className="
      overflow-hidden
      border-[#b89b72]/25
      bg-white
      shadow-sm
      transition-all
      duration-200
      hover:-translate-y-0.5
      hover:shadow-md
    "
  >
    <CardContent className="p-0">
      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-semibold tracking-tight text-[#2c2420]">
                {reservation.guestName}
              </h3>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  ${statusClass}
                `}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {reservation.status}
              </span>
            </div>

            <p className="mt-1.5 break-all text-xs text-[#77716b]">
              Reservation #{reservation.id}
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-[#77716b] sm:flex-row sm:flex-wrap sm:gap-x-5">
              <div className="flex min-w-0 items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#b89b72]" />

                <span className="truncate">
                  {reservation.guestEmail}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#b89b72]" />

                <span>
                  {reservation.guestPhone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Clock3 className="h-4 w-4 text-[#b89b72]" />

            <span
              className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-semibold
                ${stayStageClass}
              `}
            >
              {stayStageLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="border-y border-[#b89b72]/15 bg-[#f4eee7]/60">
        <div className="grid gap-px bg-[#b89b72]/15 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white px-5 py-5 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77716b]">
              Room
            </p>

            <p className="mt-2 text-sm font-semibold text-[#2c2420]">
              {roomType?.name ?? '—'}
            </p>

            <p className="mt-1 text-xs text-[#77716b]">
              Room {room?.roomNumber ?? '—'}
            </p>
          </div>

          <div className="bg-white px-5 py-5 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77716b]">
              Stay
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-[#2c2420]">
                  {formatDate(reservation.checkIn)}
                </p>

                <p className="mt-1 text-[11px] uppercase tracking-wide text-[#77716b]">
                  Check-in
                </p>
              </div>

              <span className="text-[#b89b72]">
                →
              </span>

              <div>
                <p className="text-sm font-semibold text-[#2c2420]">
                  {formatDate(reservation.checkOut)}
                </p>

                <p className="mt-1 text-[11px] uppercase tracking-wide text-[#77716b]">
                  Check-out
                </p>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center rounded-md bg-[#f4eee7] px-2 py-1">
              <span className="text-xs font-medium text-[#2c2420]">
                {nights}{' '}
                night
                {nights !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="bg-white px-5 py-5 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77716b]">
              Guests
            </p>

            <div className="mt-2 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4eee7]">
                <Users className="h-4 w-4 text-[#b89b72]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#2c2420]">
                  {reservation.adults}{' '}
                  adult
                  {reservation.adults !== 1
                    ? 's'
                    : ''}
                </p>

                <p className="mt-1 text-xs text-[#77716b]">
                  {reservation.children}{' '}
                  children
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white px-5 py-5 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77716b]">
              Total
            </p>

            <p className="mt-2 text-lg font-bold tracking-tight text-[#2c2420]">
              {formatPrice(reservation.totalPrice)}
            </p>

            <p className="mt-1 text-xs text-[#77716b]">
              {formatPrice(reservation.pricePerNight)}
              {' '}
              / night
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-xs text-[#77716b]">
          <CalendarDays className="h-4 w-4 text-[#b89b72]" />

          <span>
            {stayStage === 'PENDING'
              ? 'Waiting for confirmation'
              : stayStage === 'UPCOMING'
                ? 'Guest arriving within 24 hours'
                : stayStage === 'OCCUPIED'
                  ? 'Guest is currently staying'
                  : stayStage === 'CHECKED_OUT'
                    ? 'Guest has checked out'
                    : 'Reservation confirmed'}
          </span>
        </div>

        {reservation.status === 'PENDING' && (
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              disabled={
                isPending &&
                updatingReservationId === reservation.id
              }
              onClick={() =>
                handleStatusUpdate(
                  reservation.id,
                  'CONFIRMED'
                )
              }
              className="
                flex-1
                rounded-lg
                bg-[#2c2420]
                px-4
                text-[#f4eee7]
                hover:bg-[#b89b72]
                hover:text-[#2c2420]
                sm:flex-none
              "
            >
              {isPending &&
              updatingReservationId === reservation.id ? (
                <>Confirming...</>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirm
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={
                isPending &&
                updatingReservationId === reservation.id
              }
              onClick={() =>
                handleStatusUpdate(
                  reservation.id,
                  'CANCELLED'
                )
              }
              className="
                flex-1
                rounded-lg
                border-[#b89b72]/40
                bg-transparent
                px-4
                text-[#2c2420]
                hover:bg-[#f4eee7]
                hover:text-[#2c2420]
                sm:flex-none
              "
            >
              {isPending &&
              updatingReservationId === reservation.id ? (
                <>Updating...</>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              )}
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
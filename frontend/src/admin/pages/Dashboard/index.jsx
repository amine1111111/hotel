

import useAdminReservations from '../../hooks/useAdminReservations'

import ReservationsList from './components/ReservationsList'

const Dashboard = () => {
  console.log(
    '========== FRONTEND ADMIN: DASHBOARD / RESERVATIONS =========='
  )

  const {
    data: reservations,
    isLoading,
    error,
  } = useAdminReservations()

  console.log(
    'Frontend admin dashboard reservations:',
    reservations
  )

  console.log(
    'Frontend admin dashboard loading:',
    isLoading
  )

  console.log(
    'Frontend admin dashboard error:',
    error
  )

  console.log(
    'Frontend admin dashboard reservation count:',
    reservations?.length ?? 0
  )

  return (
    <div className="min-h-screen">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <section className="border-b border-stone-200 bg-white px-8 py-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Reservations
        </h1>

        <p className="mt-2 text-sm text-stone-500">
          Manage pending and confirmed reservations.
        </p>
      </section>

      {/* =====================================================
          RESERVATIONS
          ===================================================== */}

      <section className="px-8 py-10">

        {/* LOADING */}
        {isLoading && (
          <div className="rounded-xl border border-stone-200 bg-white p-8">
            <p className="text-sm text-stone-500">
              Loading reservations...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8">
            <p className="text-sm font-medium text-red-700">
              Failed to load reservations.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        )}

        {/* RESERVATION MANAGEMENT */}
        {!isLoading && !error && (
          <ReservationsList
            reservations={reservations ?? []}
          />
        )}

      </section>

    </div>
  )
}

export default Dashboard
import { HOTEL_TIMEZONE } from '../config/env.js'

// ============================================================
// HOTEL DATE UTILITIES
// ============================================================

// ! Booking dates come from <input type="date"> as calendar
// ! dates such as "2026-09-14".
//
// ? JavaScript's new Date("2026-09-14") interprets that value
// ? as UTC midnight, which becomes 01:00 in Algeria.
//
// ? This helper explicitly creates the date at midnight in
// ? the hotel's timezone instead.

// ============================================================
// CONVERT CALENDAR DATE → HOTEL TIMEZONE MIDNIGHT
// ============================================================

const createHotelDate = (dateString) => {

  console.log(
    '========== HOTEL DATE CONVERSION START =========='
  )

  console.log(
    'Raw calendar date received:',
    dateString
  )

  console.log(
    'Hotel timezone:',
    HOTEL_TIMEZONE
  )

  // ! Only accept the YYYY-MM-DD format produced by
  // ! the HTML <input type="date">.

  if (
    typeof dateString !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {

    console.error(
      'Invalid calendar date format:',
      dateString
    )

    throw new Error(
      'Invalid calendar date format'
    )
  }

  const [year, month, day] =
    dateString.split('-').map(Number)

  console.log(
    'Parsed calendar date:',
    {
      year,
      month,
      day,
    }
  )

  // ! Africa/Algiers is UTC+01:00.
  //
  // ? We intentionally construct the corresponding UTC
  // ? timestamp so that the stored instant represents
  // ? midnight in the hotel's local calendar.
  //
  // Example:
  //
  // Hotel:
  // 2026-09-14 00:00 Africa/Algiers
  //
  // UTC:
  // 2026-09-13 23:00 UTC

  const hotelDate =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        0,
        0,
        0
      ) -
      60 * 60 * 1000
    )

  console.log(
    'Date stored as UTC:',
    hotelDate
  )

  console.log(
    'Date stored as ISO:',
    hotelDate.toISOString()
  )

  console.log(
    '========== HOTEL DATE CONVERSION COMPLETE =========='
  )

  return hotelDate
}












// ============================================================
// FORMAT DATE → HOTEL CALENDAR DATE
// ============================================================

// ! Database dates are stored as UTC timestamps.
//
// ? When we send a reservation date by email, we need to
// ? convert that timestamp back into the hotel's timezone.
//
// ? Example:
//
// ? Database:
// ? 2026-09-17T23:00:00.000Z
//
// ? Hotel timezone:
// ? Africa/Algiers
//
// ? Result:
// ? 2026-09-18

const formatHotelDate = (date) => {

  console.log(
    '========== HOTEL DATE FORMATTING START =========='
  )

  console.log(
    'Raw date received:',
    date
  )

  console.log(
    'Hotel timezone:',
    HOTEL_TIMEZONE
  )

  const formattedDate =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone: HOTEL_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }
    ).format(new Date(date))

  console.log(
    'Formatted hotel calendar date:',
    formattedDate
  )

  console.log(
    '========== HOTEL DATE FORMATTING COMPLETE =========='
  )

  return formattedDate
}



// ============================================================
// EXPORTS
// ============================================================

export {
  createHotelDate,
  formatHotelDate
}
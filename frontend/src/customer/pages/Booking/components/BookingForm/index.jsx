import { useEffect, useState, useActionState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { Loader2 } from "lucide-react"

import { checkAvailability as checkRoomAvailability } from "@/api/rooms"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const getToday = () => {
  const today = new Date()

  return today.toISOString().split("T")[0]
}

const addOneDay = (date) => {
  const nextDay = new Date(date)

  nextDay.setDate(nextDay.getDate() + 1)

  return nextDay.toISOString().split("T")[0]
}

const getNumberOfNights = (checkIn, checkOut) => {
  const start = new Date(checkIn)
  const end = new Date(checkOut)

  return Math.ceil(
    (end - start) / (1000 * 60 * 60 * 24)
  )
}

const checkAvailability = async (previousState, formData) => {
  const bookingData = {
    roomId: formData.get("roomId"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    adults: Number(formData.get("adults")),
    children: Number(formData.get("children") || 0),
  }

  if (!bookingData.checkIn || !bookingData.checkOut) {
    return {
      status: "error",
      message: "booking.errors.datesRequired",
    }
  }

  if (bookingData.checkOut <= bookingData.checkIn) {
    return {
      status: "error",
      message: "booking.errors.minimumStay",
    }
  }

  try {
    const data = await checkRoomAvailability({
      roomId: bookingData.roomId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
    })

    if (!data.available) {
      return {
        status: "unavailable",
        message: "booking.errors.unavailable",
      }
    }

    const nights = getNumberOfNights(
      bookingData.checkIn,
      bookingData.checkOut
    )

    return {
      status: "available",
      message: "booking.success.available",
      booking: {
        roomId: bookingData.roomId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children,
        nights,
      },
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error.message ||
        "booking.errors.serverConnection",
    }
  }
}

const BookingForm = ({ room }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("booking")

  const maxAdults =
    room?.capacity?.maxAdults || 0

  const maxChildren =
    room?.capacity?.maxChildren || 0

  const maxGuests =
    room?.capacity?.maxGuests || 0

  const pricePerNight =
    room?.pricePerNight || 0

  const acceptsChildren = maxChildren > 0

  const [state, formAction, isPending] =
    useActionState(
      checkAvailability,
      null
    )

  const [checkIn, setCheckIn] =
    useState(getToday())

  const [checkOut, setCheckOut] =
    useState(addOneDay(getToday()))

  const [adults, setAdults] =
    useState(maxAdults)

  const [children, setChildren] =
    useState(
      acceptsChildren ? maxChildren : 0
    )

  const nights =
    checkIn && checkOut
      ? getNumberOfNights(
          checkIn,
          checkOut
        )
      : 0

  const totalPrice =
    nights * pricePerNight

  useEffect(() => {
    if (state?.status === "available") {
      navigate("/booking/recap", {
        state: {
          room,
          booking: state.booking,
          pricePerNight,
          totalPrice,
        },
      })
    }
  }, [
    state,
    navigate,
    room,
    pricePerNight,
    totalPrice,
  ])

  if (
    !room ||
    maxAdults <= 0 ||
    maxGuests <= 0 ||
    pricePerNight <= 0
  ) {
    return null
  }

  const translatedError =
    state?.message?.startsWith("booking.")
      ? t(state.message)
      : state?.message

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="roomId"
        value={room.id}
      />

      <div className="space-y-2">
        <Label
          htmlFor="checkIn"
          className="text-foreground"
        >
          {t("form.checkIn")}
        </Label>

        <input
          id="checkIn"
          name="checkIn"
          type="date"
          value={checkIn}
          min={getToday()}
          required
          onChange={(event) => {
            const value = event.target.value

            setCheckIn(value)

            if (checkOut <= value) {
              setCheckOut(
                addOneDay(value)
              )
            }
          }}
          className="
            h-11
            w-full
            rounded-md
            border
            border-border
            bg-background
            px-3
            text-sm
            text-foreground
            outline-none
            focus:border-ring
            focus:ring-2
            focus:ring-ring/20
          "
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="checkOut"
          className="text-foreground"
        >
          {t("form.checkOut")}
        </Label>

        <input
          id="checkOut"
          name="checkOut"
          type="date"
          value={checkOut}
          min={addOneDay(checkIn)}
          required
          onChange={(event) =>
            setCheckOut(event.target.value)
          }
          className="
            h-11
            w-full
            rounded-md
            border
            border-border
            bg-background
            px-3
            text-sm
            text-foreground
            outline-none
            focus:border-ring
            focus:ring-2
            focus:ring-ring/20
          "
        />
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">
          {t("form.adults")}
        </Label>

        <Select
          value={String(adults)}
          onValueChange={(value) =>
            setAdults(Number(value))
          }
        >
          <SelectTrigger
            className="
              h-11
              border-border
              bg-background
              text-foreground
              focus:ring-ring/20
            "
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {Array.from(
              {
                length: maxAdults,
              },
              (_, index) => (
                <SelectItem
                  key={index + 1}
                  value={String(index + 1)}
                >
                  {index + 1}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <input
          type="hidden"
          name="adults"
          value={adults}
        />
      </div>

      {acceptsChildren && (
        <div className="space-y-2">
          <Label className="text-foreground">
            {t("form.children")}
          </Label>

          <Select
            value={String(children)}
            onValueChange={(value) =>
              setChildren(Number(value))
            }
          >
            <SelectTrigger
              className="
                h-11
                border-border
                bg-background
                text-foreground
                focus:ring-ring/20
              "
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {Array.from(
                {
                  length: maxChildren + 1,
                },
                (_, index) => (
                  <SelectItem
                    key={index}
                    value={String(index)}
                  >
                    {index}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <input
            type="hidden"
            name="children"
            value={children}
          />
        </div>
      )}

      <div
        className="
          rounded-lg
          bg-background
          px-4
          py-3
        "
      >
        <p className="text-sm text-muted-foreground">
          {t("form.maximumGuests", {
            count: maxGuests,
          })}
        </p>
      </div>

      <div
        className="
          border-t
          border-border
          pt-5
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {pricePerNight.toLocaleString()} DA ×{" "}
            {nights}{" "}
            {nights === 1
              ? t("form.night")
              : t("form.nights")}
          </span>

          <span className="text-lg font-semibold text-foreground">
            {totalPrice.toLocaleString()} DA
          </span>
        </div>
      </div>

      {(state?.status === "error" ||
        state?.status === "unavailable") && (
        <div
          className="
            rounded-lg
            border
            border-border
            bg-background
            px-4
            py-3
          "
        >
          <p className="text-sm text-foreground">
            {translatedError}
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="
          h-11
          w-full
          rounded-lg
          bg-primary
          text-primary-foreground
          hover:bg-secondary
          hover:text-secondary-foreground
        "
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("form.checkingAvailability")}
          </>
        ) : (
          t("form.checkAvailability")
        )}
      </Button>
    </form>
  )
}

export default BookingForm
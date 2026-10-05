import { useActionState } from "react"
import { useTranslation } from "react-i18next"

import {
  Mail,
  Phone,
  User,
  Loader2,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const submitReservation = async (
  previousState,
  formData,
  booking,
  t
) => {
  const firstName =
    formData.get("firstName")?.trim() || ""

  const lastName =
    formData.get("lastName")?.trim() || ""

  const email =
    formData.get("email")?.trim() || ""

  const phone = formData.get("phone") || ""

  if (!firstName || !lastName) {
    return {
      status: "error",
      message: t("guest.errors.nameRequired"),
    }
  }

  if (!/^[^\s@]+@gmail\.com$/.test(email)) {
    return {
      status: "error",
      message: t("guest.errors.invalidEmail"),
    }
  }

  if (!/^\d{10}$/.test(phone)) {
    return {
      status: "error",
      message: t("guest.errors.invalidPhone"),
    }
  }

  if (!booking) {
    return {
      status: "error",
      message: t("guest.errors.missingBooking"),
    }
  }

  try {
    const reservationData = {
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: booking.adults,
      children: booking.children,
      guestName: `${firstName} ${lastName}`,
      guestEmail: email,
      guestPhone: phone,
    }

    const response = await fetch(
      "http://localhost:5000/api/reservations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message ||
          t("guest.errors.submissionFailed"),
      }
    }

    return {
      status: "success",
      message: t("guest.success.submitted"),
      reservation: data.reservation,
    }
  } catch {
    return {
      status: "error",
      message: t("guest.errors.serverConnection"),
    }
  }
}

const GuestInformation = ({ booking, onSuccess }) => {
  const { t } = useTranslation("booking")

  const reservationAction = async (
    previousState,
    formData
  ) => {
    const result = await submitReservation(
      previousState,
      formData,
      booking,
      t
    )

    if (result.status === "success") {
      onSuccess(result.reservation)
    }

    return result
  }

  const [state, formAction, isPending] =
    useActionState(
      reservationAction,
      null
    )

  return (
    <section>
      <div className="mb-7">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {t("guest.title")}
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          {t("guest.description")}
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-foreground"
          >
            {t("guest.firstName.label")}
          </Label>

          <div className="relative">
            <User
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
              strokeWidth={1.8}
            />

            <Input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className="
                h-11
                border-border
                bg-background
                pl-10
                shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                focus:border-ring
                focus:ring-ring/20
              "
              placeholder={t(
                "guest.firstName.placeholder"
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-foreground"
          >
            {t("guest.lastName.label")}
          </Label>

          <div className="relative">
            <User
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
              strokeWidth={1.8}
            />

            <Input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              className="
                h-11
                border-border
                bg-background
                pl-10
                shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                focus:border-ring
                focus:ring-ring/20
              "
              placeholder={t(
                "guest.lastName.placeholder"
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            {t("guest.email.label")}
          </Label>

          <div className="relative">
            <Mail
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
              strokeWidth={1.8}
            />

            <Input
              id="email"
              name="email"
              type="email"
              pattern="[^\s@]+@gmail\.com"
              placeholder={t(
                "guest.email.placeholder"
              )}
              autoComplete="email"
              required
              className="
                h-11
                border-border
                bg-background
                pl-10
                shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                focus:border-ring
                focus:ring-ring/20
              "
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {t("guest.email.helper")}
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-foreground"
          >
            {t("guest.phone.label")}
          </Label>

          <div className="relative">
            <Phone
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                z-10
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
              strokeWidth={1.8}
            />

            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              placeholder={t(
                "guest.phone.placeholder"
              )}
              autoComplete="tel"
              required
              onInput={(event) => {
                event.currentTarget.value =
                  event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
              }}
              className="
                h-11
                border-border
                bg-background
                pl-10
                shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                focus:border-ring
                focus:ring-ring/20
              "
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {t("guest.phone.helper")}
          </p>
        </div>

        {state?.status === "error" && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">
              {state.message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-primary
            px-5
            text-sm
            font-medium
            text-primary-foreground
            shadow-sm
            transition
            hover:bg-secondary
            hover:text-secondary-foreground
            focus:outline-none
            focus:ring-2
            focus:ring-ring/30
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("guest.submitting")}
            </>
          ) : (
            t("guest.submit")
          )}
        </button>
      </form>
    </section>
  )
}

export default GuestInformation
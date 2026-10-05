import * as Dialog from "@radix-ui/react-dialog"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const ReservationSuccessModal = ({
  reservation,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation("booking")

  const handleBackToHome = () => {
    navigate("/")
  }

  return (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed
            inset-0
            z-50
            bg-black/60
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            z-50
            w-[calc(100%-2rem)]
            max-w-lg
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            bg-card
            p-8
            text-foreground
            shadow-2xl
            outline-none
          "
        >
          <Dialog.Close
            className="
              absolute
              right-4
              top-4
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
            "
            aria-label={t("successModal.close")}
          >
            ×
          </Dialog.Close>

          <div className="flex justify-center">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-3xl
                text-secondary
              "
            >
              ✓
            </div>
          </div>

          <Dialog.Title
            className="
              mt-5
              text-center
              text-2xl
              font-semibold
              text-foreground
            "
          >
            {t("successModal.title")}
          </Dialog.Title>

          <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">
            {t("successModal.description")}
          </p>

          {reservation?.guestEmail && (
            <p className="mt-5 text-center text-xs text-muted-foreground">
              {t("successModal.emailPrefix")}{" "}
              <span className="font-medium text-foreground">
                {reservation.guestEmail}
              </span>
              {t("successModal.emailSuffix")}
            </p>
          )}

          <div className="mt-6">
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={handleBackToHome}
                className="
                  w-full
                  rounded-lg
                  bg-primary
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-primary-foreground
                  transition
                  hover:bg-secondary
                  hover:text-secondary-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring/30
                "
              >
                {t("successModal.backToHome")}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ReservationSuccessModal
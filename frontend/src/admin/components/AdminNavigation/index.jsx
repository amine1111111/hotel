
import { useRef } from 'react'

import {
  NavLink,
  useLocation,
} from 'react-router-dom'


import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);


import {
  CalendarDays,
  BedDouble,
} from 'lucide-react'

// =====================================================
// ADMIN NAVIGATION
// =====================================================

const AdminNavigation = () => {
  console.log(
    '========== FRONTEND ADMIN: NAVIGATION =========='
  )

  const location = useLocation()

  const navigationRef = useRef(null)
  const activeIndicatorRef = useRef(null)

  const reservationsRef = useRef(null)
  const roomsRef = useRef(null)

  // =====================================================
  // ACTIVE INDICATOR ANIMATION
  // =====================================================

  useGSAP(
    () => {
      console.log(
        '========== FRONTEND ADMIN: NAVIGATION ANIMATION =========='
      )

      console.log(
        'Admin navigation active route:',
        location.pathname
      )

      const activeRef =
        location.pathname === '/admin/rooms'
          ? roomsRef
          : reservationsRef

      const activeElement =
        activeRef.current

      const indicator =
        activeIndicatorRef.current

      const navigation =
        navigationRef.current

      if (
        !activeElement ||
        !indicator ||
        !navigation
      ) {
        console.warn(
          'Admin navigation: animation elements not found'
        )

        return
      }

      const navigationRect =
        navigation.getBoundingClientRect()

      const activeRect =
        activeElement.getBoundingClientRect()

      const x =
        activeRect.left -
        navigationRect.left +
        activeRect.width / 2 -
        indicator.offsetWidth / 2

      console.log(
        'Admin navigation indicator X:',
        x
      )

      gsap.to(indicator, {
        x,
        duration: 0.45,
        ease: 'power3.out',
      })

      console.log(
        'Admin navigation indicator animation started'
      )
    },
    {
      scope: navigationRef,
      dependencies: [
        location.pathname,
      ],
    }
  )

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <nav
      ref={navigationRef}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-[9999px] border border-white/30 bg-white/60 py-2 px-3 shadow-lg shadow-stone-900/10 backdrop-blur-xl"
    >

      {/* =====================================================
          ACTIVE INDICATOR
          ===================================================== */}

      <div
        ref={activeIndicatorRef}
        className="pointer-events-none absolute bottom-2 left-0 h-10 w-10 rounded-full bg-stone-900"
      />

      {/* =====================================================
          NAVIGATION ITEMS
          ===================================================== */}

      <div className="relative flex items-center gap-1 ">

        {/* =====================================================
            RESERVATIONS
            ===================================================== */}

        <NavLink
          ref={reservationsRef}
          to="/admin"
          end
          aria-label="Reservations"
          onClick={() => {
            console.log(
              'Frontend admin navigation clicked: Reservations'
            )
          }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full"
        >
          {({ isActive }) => (
            <CalendarDays
              size={19}
              strokeWidth={1.8}
              className={
                isActive
                  ? 'text-white'
                  : 'text-stone-500'
              }
            />
          )}
        </NavLink>

        {/* =====================================================
            ROOMS
            ===================================================== */}

        <NavLink
          ref={roomsRef}
          to="/admin/rooms"
          aria-label="Rooms"
          onClick={() => {
            console.log(
              'Frontend admin navigation clicked: Rooms'
            )
          }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full"
        >
          {({ isActive }) => (
            <BedDouble
              size={19}
              strokeWidth={1.8}
              className={
                isActive
                  ? 'text-white'
                  : 'text-stone-500'
              }
            />
          )}
        </NavLink>

      </div>
    </nav>
  )
}

export default AdminNavigation
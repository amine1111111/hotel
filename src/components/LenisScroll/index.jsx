import { useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'

import LenisScrollContext from './LenisScrollContext'

const LenisScroll = ({ children }) => {
  const lenisRef = useRef(null)

  const controller = useMemo(() => {
    return {
      stop: () => {
        lenisRef.current?.stop()
      },

      start: () => {
        lenisRef.current?.start()
      },

      scrollTo: (target, options) => {
        lenisRef.current?.scrollTo(target, options)
      },

      getInstance: () => {
        return lenisRef.current
      },
    }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    })

    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisScrollContext.Provider value={controller}>
      {children}
    </LenisScrollContext.Provider>
  )
}

export default LenisScroll
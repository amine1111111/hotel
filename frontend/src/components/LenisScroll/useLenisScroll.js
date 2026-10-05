import { useContext } from 'react'

import LenisScrollContext from './LenisScrollContext'

const useLenisScroll = () => {
  return useContext(LenisScrollContext)
}

export default useLenisScroll
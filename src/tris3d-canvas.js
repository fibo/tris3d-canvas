import React from 'react'
import { render } from 'react-dom'

import Scene from './components/Scene'

const init = (element) => {
  render(<Scene />, element)
}

export default module.exports = init

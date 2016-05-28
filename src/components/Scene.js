import React from 'react'
import Box from './Box'

const Scene = () => {
  const width = 500
  const height = 500

  return (
    <x3d width={width} height={height}>
      <scene>
        <Box />
      </scene>
    </x3d>
  )
}

export default Scene

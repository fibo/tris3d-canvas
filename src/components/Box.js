import React from 'react'

const Box = () => {
  const translation = '-3 -3 -3'
  const diffuseColor = '0 0 1'

  return (
    <transform translation={translation}>
      <shape>
        <appearance>
          <material diffuseColor={diffuseColor}></material>
        </appearance>
        <box></box>
      </shape>
    </transform>
  )
}

export default Box

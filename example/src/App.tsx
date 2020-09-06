import React, { useState } from 'react'

import { RangeSlider, RangeSliderTypes } from 'orderandchaos-react-range-slider'
import 'orderandchaos-react-range-slider/dist/index.css'
import { ContainerFullWidth, Row, Column, styles } from '@orderandchaos/react-components-typescript'

const App = () => {
  const [linearValue, setLinearValue] = useState<number>(0)
  const [logValue, setLogValue] = useState<number>(100)
  return (
    <ContainerFullWidth className={styles.bc_lighterGrey}>
      <Row>
        <Column columnClass={styles.col6}>
          <input readOnly={true} value={linearValue}/>
          <RangeSlider value={linearValue} setValue={setLinearValue} min={0} max={100} step={0.1}/>
        </Column>
        <Column columnClass={styles.col6}>
          <input readOnly={true} value={logValue}/>
          <RangeSlider value={logValue} setValue={setLogValue} type={RangeSliderTypes.LOG} min={100} max={100000} decimalPlaces={0}/>
        </Column>
      </Row>
    </ContainerFullWidth>
  )
}

export default App

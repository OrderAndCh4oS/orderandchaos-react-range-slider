import * as React from 'react'
import { ChangeEvent, FC, FocusEvent } from 'react'
import styles from './styles.module.css'

export const logScale = (value: number, max: number, min: number = 1): number => {
  if(value === 0) return min;

  const minP = 1
  const maxP = 1000

  const minV = Math.log(min)
  const maxV = Math.log(max)

  const scale = (maxV - minV) / (maxP - minP)

  const result = Math.exp(minV + scale * (value - minP))
  console.log('log', value, max, min, minV, maxV, scale)
  console.log('log', result)
  return result
}

export const inverseLogScale = (lg: number, max: number, min: number = 1): number => {
  if(lg === 0) return min;

  const minP = 1
  const maxP = 1000

  const minV = Math.log(min)
  const maxV = Math.log(max)

  const scale = (maxV - minV) / (maxP - minP)
  const result = (Math.log(lg) - minV) / scale + minP
  console.log('inverse', lg, max, min, minV, maxV, scale)
  console.log('inverse', result)
  return result
}

const getMin = (type: RangeSliderTypes, value: number): number => {
  switch (type) {
    case RangeSliderTypes.LINEAR:
      return value
    case RangeSliderTypes.LOG:
      return 0
  }
}

const getMax = (type: RangeSliderTypes, value: number): number => {
  switch (type) {
    case RangeSliderTypes.LINEAR:
      return value
    case RangeSliderTypes.LOG:
      return 1000
  }
}

const getValue = (type: RangeSliderTypes, value: number, max: number, min: number = 0): number => {
  switch (type) {
    case RangeSliderTypes.LINEAR:
      return value
    case RangeSliderTypes.LOG:
      return inverseLogScale(value, max, min)
  }
}

const toDecimalPlaces = (value: number, decimalPlaces: number, base = 10): number => {
  const pow = Math.pow(base||10, decimalPlaces);
  return Math.round(value*pow) / pow;
}

export enum RangeSliderTypes {
  LOG,
  LINEAR
}

interface Props {
  step?: number,
  min?: number,
  max?: number,
  value?: number,
  type?: RangeSliderTypes,
  showTab?: boolean,
  decimalPlaces?: number
  setValue: (value: number) => void,
}

const handleChange = (type: RangeSliderTypes, setValue: (value: number) => void, decimalPlaces: number, max: number, min: number) => (e: ChangeEvent<HTMLInputElement>) => {
  switch (type) {
    case RangeSliderTypes.LINEAR:
      setValue(toDecimalPlaces(Number(e.target.value), decimalPlaces))
      break
    case RangeSliderTypes.LOG:
      setValue(toDecimalPlaces(logScale(Number(e.target.value), max, min), decimalPlaces))
      break
  }
}

const handleBlur = (type: RangeSliderTypes, setValue: (value: number) => void, max: number, min: number, decimalPlaces: number) => (e: FocusEvent<HTMLInputElement>) => {
  switch (type) {
    case RangeSliderTypes.LINEAR:
      setValue(Number(e.target.value))
      break
    case RangeSliderTypes.LOG:
      setValue(toDecimalPlaces(logScale(Number(e.target.value), max, min), decimalPlaces))
      break
  }
}

export const RangeSlider: FC<Props> = (
  {
    setValue,
    type = RangeSliderTypes.LINEAR,
    showTab = true,
    step = 1,
    min = 0,
    max = 100,
    value = 0,
    decimalPlaces = 3,
    ...rest
  }) => {
  return (
    <div className={styles.rangeSlider_wrapper}>
      {showTab && <span className={styles.rangeSlider_tab}/>}
      <input
        type="range"
        className={styles.rangeSlider}
        onChange={handleChange(type, setValue, decimalPlaces, max, min)}
        onBlur={handleBlur(type, setValue, max, min, decimalPlaces)}
        value={getValue(type, value, max, min).toFixed(decimalPlaces)}
        min={getMin(type, min)}
        max={getMax(type, max)}
        {...rest}
      />
    </div>
  )
}

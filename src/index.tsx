import * as React from 'react'
import { ChangeEvent, FC, FocusEvent, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

export const logScale = (value: number, max: number, min: number = 1): number => {
  if(value === 0) return min;

  const minP = 1
  const maxP = 1000

  const minV = Math.log(min)
  const maxV = Math.log(max)

  const scale = (maxV - minV) / (maxP - minP)

  const result = Math.exp(minV + scale * (value - minP))
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
  showTabTop?: boolean,
  showTabBottom?: boolean,
  decimalPlaces?: number
  setValue: (value: number) => void,
}

const getActualValue = (value: string | number, type: RangeSliderTypes, max: number, min: number, decimalPlaces: number) => {
  switch (type) {
    case RangeSliderTypes.LINEAR:
      return toDecimalPlaces(Number(value), decimalPlaces)
    case RangeSliderTypes.LOG:
      return toDecimalPlaces(logScale(Number(value), max, min), decimalPlaces)
  }
}

const handleChange = (type: RangeSliderTypes, setValue: (value: number) => void, decimalPlaces: number, max: number, min: number) => (e: ChangeEvent<HTMLInputElement>) => {
  setValue(getActualValue(e.target.value, type, max, min, decimalPlaces));
}

const handleBlur = (type: RangeSliderTypes, setValue: (value: number) => void, max: number, min: number, decimalPlaces: number) => (e: FocusEvent<HTMLInputElement>) => {
  setValue(getActualValue(e.target.value, type, max, min, decimalPlaces));
}

export const RangeSlider: FC<Props> = (
  {
    setValue,
    type = RangeSliderTypes.LINEAR,
    showTabTop = false,
    showTabBottom = false,
    step = 1,
    min = 0,
    max = 100,
    value = 0,
    decimalPlaces = 3,
    ...rest
  }) => {
  const [left, setLeft] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if(!showTabTop && !showTabBottom) return;
    if(!containerRef || containerRef.current === null) return;
    setLeft(((getValue(type, value, max, min) / getMax(type, max)) * (containerRef.current.clientWidth - 8)) + 4)
  }, [value, containerRef]);
  return (
    <div className={styles.rangeSlider_wrapper} ref={containerRef}>
      {showTabTop && <span
        className={[styles.rangeSlider_tab, styles.rangeSlider_tabTop].join(' ')}
        style={{left: `${left}px`}}
      >{value}</span>}
      <input
        type="range"
        className={styles.rangeSlider}
        onChange={handleChange(type, setValue, decimalPlaces, max, min)}
        onBlur={handleBlur(type, setValue, max, min, decimalPlaces)}
        value={getValue(type, value, max, min).toFixed(decimalPlaces)}
        min={getMin(type, min)}
        max={getMax(type, max)}
        step={step}
        {...rest}
      />
      {showTabBottom && <span
        className={styles.rangeSlider_tab}
        style={{left: `${left}px`}}
      >{value}</span>}
    </div>
  )
}

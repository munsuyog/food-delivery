import React from 'react'
import './Button.css'
import { Button } from '../../ui/button'


const ButtonComponent = ({onClick, title, fontSize}) => {
  return (
    <Button style={{fontSize: fontSize ? fontSize : 16}} onClick={onClick ? onClick : () => {}}>{title}</Button>
  )
}

export default ButtonComponent
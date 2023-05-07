import React from "react"
import "./button.scss"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const BorderButton= (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " border"})

export const MinButton = (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " min"})

export const Button = (props: ButtonProps) => <button {...{...props, className:(props.className ?? "") + " btn"}}/>

import {InputHTMLAttributes} from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({...rest}: Props) {
  return (
    <input type="text" {...rest} className={'py-1 px-3 bg-gray-100'}/>
  )
}

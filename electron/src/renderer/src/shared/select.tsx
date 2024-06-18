import {useState} from "react";
import {useClickAway} from '@uidotdev/usehooks'

interface Option {
  value: string
  display: string
}

interface Props {
  options: Option[]
  value?: string
  placeholder?: string
  handleChange: (value: string) => void
}

export function Select ({value, options, placeholder, handleChange}: Props) {
  const [ open, setOpen ] = useState(false)

  const refObject = useClickAway<HTMLDivElement>(() => {
    setOpen(false)
  })


  return (
    <div className={'flex relative w-fit'} ref={refObject}>
      <button className={'bg-gray-100 px-3 py-2 rounded-xl'} onClick={() => setOpen(true)}>{ options.find((o) => o.value === value)?.display ?? placeholder }</button>

      {open && (
        <div className={'absolute bottom-0 translate-y-[110%] bg-gray-100 w-full'}>
          {options.map((o) =>
            <button type={"button"} onClick={() => handleChange(o.value)}>{o.display}</button>
          )}
        </div>
      )}

    </div>
  )
}

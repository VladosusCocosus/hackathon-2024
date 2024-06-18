import {useOnline} from "../../../hooks/online";

export function NetworkStatus() {
  const status = useOnline()

  if (!status) {
    return (
      <div className={'flex flex-row flex-1 justify-center items-center bg-black text-white'}>
        Offline
      </div>
    )
  }

  return null
}

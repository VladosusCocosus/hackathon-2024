import {Content, Flex, View} from "@adobe/react-spectrum";
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline'
import {useDevice} from "../../../hooks/use-device";
import {useStore} from "../../../hooks/use-store";
import {platformNames, PlatformNames} from "../../../../../types/platforms";

export function Info() {
  return (
    <View padding={'size-150'}>
      <Flex direction={'row'} gap={'size-100'} alignItems={'center'}>
        <Platform/>
        <Device/>
      </Flex>
    </View>
  )
}

export function Device() {
  const device = useDevice()

  return (
    <View paddingY={'size-25'} paddingX={'size-200'} borderColor={"blue-400"} borderWidth={'thick'} borderRadius={'large'}>
      <Content>{device?.connected ? device.name : "Connect"}</Content>
    </View>
  )
}

function Platform () {
  const [ currentBroadcast ] = useStore<PlatformNames>('current-broadcast')

  return (

    <View paddingY={'size-25'} paddingX={'size-100'} borderRadius={'large'} borderColor={"blue-400"} borderWidth={'thick'} backgroundColor={'blue-400'}>
      <Flex gap={'size-100'}>
        {currentBroadcast ? platformNames[currentBroadcast] : 'Choose platform'} <CursorArrowRaysIcon width={18}/>
      </Flex>
    </View>
  )
}

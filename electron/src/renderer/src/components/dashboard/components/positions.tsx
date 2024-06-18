import {Pipeline} from "../../../../../utils/platforms/common";
import {Flex, View} from "@adobe/react-spectrum";

interface Props {
  data: Pipeline
}


export function Positions({data}: Props) {
  return (
    <View>
      <h3 style={{gap: '10px', display: 'flex', flexDirection: 'row'}}>{data.name}</h3>

      <View paddingX={'size-200'} paddingY={'size-100'} backgroundColor={'gray-100'}
            borderRadius={'regular'}>

        <Flex direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <span>{data.info.name}</span> <span style={{ color: !["failed", 'error'].includes(data.info.status) ? 'green': 'red' }}>{!["failed", 'error'].includes(data.info.status) ? 'Ok!': 'Wasted'}</span>
        </Flex>
      </View>

    </View>
  )
}

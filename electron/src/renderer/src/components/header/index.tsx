import {Info} from "./components/info";
import {Flex, View} from "@adobe/react-spectrum";
import {NetworkStatus} from "./components/network-status";
import {useLocation, useNavigate} from "react-router-dom";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation()

  return (
    <View borderRadius={'regular'} marginX={'size-200'} backgroundColor={'gray-200'}>
      <Flex direction={'column'}>
        <NetworkStatus/>
        <Flex
          direction={"row"}
          justifyContent={'space-between'}
          marginEnd={'size-100'}
          alignContent={'center'}
        >
          {location.pathname === '/' ? (
            <div/>
          ) : <div onClick={() => navigate(-1)} style={{display: 'flex', alignItems: 'center', paddingLeft: '20px'}}>
            <ArrowLeftIcon width={20} strokeWidth={3}/>
          </div>}

          <Info/>
        </Flex>
      </Flex>
    </View>
  )
}

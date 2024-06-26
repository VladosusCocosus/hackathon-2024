import {Header, View, Flex} from "@adobe/react-spectrum";
import {ChoosePlatform} from "./components/choose-platform";
import {useStore} from "../../hooks/use-store";
import {Platform} from "../../../../types/platforms";
import {useEffect, useState} from "react";
import {Positions} from "./components/positions";
import {Pipeline} from "../../../../utils/platforms/common";
import {Devices} from "./components/devices";

export function Dashboard () {
  const [settings ] = useStore<Platform[]>('platforms')
  const [pipeLine , setPipeLine] = useState<Pipeline[] | null>()

  useEffect(() => {
    window.electron.onUpdatePNL((value) => setPipeLine(value))
  }, []);


  useEffect(() => {
    if (!settings) {
      return;
    }

    if (settings) {
      void window.electron.ipcRenderer.invoke('start-broadcast')
    }
  }, [settings]);

  const hasError = pipeLine?.some((p) => p.info.status === 'error')

  return (
    <View paddingX={'size-400'} paddingTop={'size-200'} paddingBottom={'size-400'}>
      <Header><h2>Total <span style={{color: !hasError ? 'green': 'red'}}>{hasError ? 'Wasted' : 'Ok!'}</span></h2></Header>
      <Flex direction={'column'} gap={'size-400'}>
        {settings && (
          <View>
            <Flex direction={'column'} gap={'size-200'}>
              {pipeLine?.map((l) => (
                <Positions data={l}/>
                ))}
            </Flex>
          </View>
        )}
        <ChoosePlatform/>
        <Devices/>

      </Flex>
    </View>
  );
};

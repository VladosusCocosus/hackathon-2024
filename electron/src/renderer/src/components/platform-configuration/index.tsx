import {useNavigate, useParams} from "react-router-dom";
import {Button, Flex, TextField, View} from "@adobe/react-spectrum";
import {Platform, PlatformNames, platformNames, platformsIcons} from "../../../../types/platforms";
import {useEffect, useState} from "react";
import {useStore} from "../../hooks/use-store";

interface State {
  accessToken: string
  secretToken: string
}

export function PlatformConfiguration (): JSX.Element {
  const params = useParams<{ providerName: string }>()
  const navigate = useNavigate()
  const [settings, setSettings ] = useStore<Platform[]>('platforms')

  const platform = settings?.find((s) => s.key === params.providerName)

  const [state, setState] = useState<{
    accessToken: string, secretToken: string
  }>({
    accessToken: platform?.accessToken ?? '',
    secretToken: platform?.secretToken ?? ''
    })

  const providerName = params.providerName



  if (!providerName) {
    throw new Error("Provider Name is undefined")
  }


  useEffect(() => {
    if (platform) {
      setState({
        accessToken: platform.accessToken,
        secretToken: platform.secretToken,
      })
    }
  }, [platform]);

  function handleChange(key: keyof State) {
    return (value: string) => {
      setState(prev => ({...prev, [key]: value}))
    }
  }

  function handlePress() {
    if (!providerName) {
      return
    }

    const newValue: Platform = {
      name: platformNames[providerName ?? ''],
      key: providerName as unknown as PlatformNames,
      accessToken: state.accessToken,
      secretToken: state.secretToken,
    }

    const newSettings = [...(settings?.filter((s) => s.key !== providerName) ?? []), newValue]

    setSettings(newSettings)

    navigate('/')
  }



  return (
    <View paddingX={'size-200'}>
      <Flex gap={'size-100'} alignItems={"center"}>
      <h2>
        {platformNames[params.providerName]}
      </h2>
        <img src={platformsIcons[params.providerName]} alt={params.providerName} width={30} height={30} style={{ borderRadius: '50%' }}/>
      </Flex>

      <Flex direction={'column'} gap={'size-200'}>
        <TextField minLength={5} value={state.accessToken} onChange={handleChange('accessToken')} label={'Access Token'} width={'size-3000'}/>
        <TextField minLength={5} value={state.secretToken} onChange={handleChange('secretToken')} label={'Secret Token'} width={'size-3000'}/>
        <Button variant={'accent'} onPress={handlePress}  width={'size-3000'}>Submit</Button>
      </Flex>
    </View>
  )
}

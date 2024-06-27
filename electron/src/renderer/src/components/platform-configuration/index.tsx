import {useNavigate, useParams} from "react-router-dom";
import {Button, Flex, TextField, View} from "@adobe/react-spectrum";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {request} from "../../lib/request";

interface State {
  accessToken: string
  secretToken: string
}

interface Platform {
  id: string
  name: string
  image: string
}

function usePlatform(id: string) {
  return useQuery<Platform, unknown, Platform, ['platform', string]>({
    queryKey: ['platform', id],
    async queryFn () {
      const data = await request(`/platforms/${id}`)
      return data.json()
    }
  })
}

function usePipeline() {
  return useQuery({
    queryKey: ['pipelines'],
    async queryFn () {
      // TODO: Method
      const data = await request('///')
      return data.json()
    }
  })
}

function usePlatfromTokenMutation() {

}

function usePlatfromReposMutation() {

}

export function PlatformConfiguration (): JSX.Element {
  const params = useParams<{ providerName: string }>()

  const navigate = useNavigate()

  const {data} = usePlatform(params.providerName ?? '')

  const [state, setState] = useState<{
    accessToken: string,
    secretToken: string
  }>({
    accessToken: '',
    secretToken: ''
  })

  const providerName = params.providerName

  if (!providerName) {
    throw new Error("Provider Name is undefined")
  }

  function handleChange(key: keyof State) {
    return (value: string) => {
      setState(prev => ({...prev, [key]: value}))
    }
  }

  function handlePress() {
    if (!providerName) {
      return
    }
  }



  if (!data) {
    return (
      <View/>
    )
  }

  return (
    <View paddingX={'size-200'}>
      <Flex gap={'size-100'} alignItems={"center"}>
      <h2>
        {data.name}
      </h2>
        <img src={data.image} alt={params.providerName} width={30} height={30} style={{ borderRadius: '50%' }}/>
      </Flex>

      <Flex direction={'column'} gap={'size-200'}>
        <TextField minLength={5} value={state.accessToken} onChange={handleChange('accessToken')} label={'Access Token'} width={'size-3000'}/>
        <TextField minLength={5} value={state.secretToken} onChange={handleChange('secretToken')} label={'Secret Token'} width={'size-3000'}/>
        <Button variant={'accent'} onPress={handlePress}  width={'size-3000'}>Submit</Button>
      </Flex>
    </View>
  )
}

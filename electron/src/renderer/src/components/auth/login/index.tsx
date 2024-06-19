import {Button, Flex, TextField, View} from "@adobe/react-spectrum";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useLogin} from "../queries";


interface State {
  email: string
  password: string
}

export function Login(){
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [ state, setState ] = useState<State>({
    email: '',
    password: ''
  })

  function onChange(key: keyof State) {
    return (value: string) => {
      setState((prev) => ({...prev, [key]: value}))
    }
  }

  return (
    <View
      marginX={'size-200'}
      backgroundColor={'gray-200'}
      borderRadius={'regular'}
      paddingX={'size-400'}
    >
      <h1>Login</h1>

      <Flex direction={"column"} gap={'size-200'}>
        <TextField
          label={'Email'}
          type={'email'}
          width={'size-3400'}
          value={state.email}
          onChange={onChange("email")}
          isRequired={true}
        />
        <TextField
          label={'Password'}
          type={'password'}
          width={'size-3400'}
          value={state.password}
          onChange={onChange("password")}
          isRequired={true}
        />


        <Button type={'button'} width={'size-3400'} variant={'accent'} onPress={() => loginMutation.mutate(state)}>Login</Button>

        <Button onPress={() => navigate('/auth/registration')} width={'size-3400'} variant={'secondary'}>Create Account</Button>
      </Flex>

    </View>
  )
}

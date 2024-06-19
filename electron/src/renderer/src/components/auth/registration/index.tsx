import {Button, Flex, TextField, View} from "@adobe/react-spectrum";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useRegistration} from "../queries";


interface State {
  email: string
  password: string
  name: string
}

export function Registration(){
  const registrateMutation  =useRegistration()
  const navigate = useNavigate()
  const [ state, setState ] = useState<State>({
    email: '',
    password: '',
    name: ''
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
          label={'Name'}
          type={'text'}
          width={'size-3400'}
          value={state.name}
          onChange={onChange("name")}
          isRequired={true}
        />
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
        <Button type={'button'} width={'size-3400'} variant={'accent'} onPress={() => registrateMutation.mutate(state)}>Create Account</Button>


        <Button onPress={() => navigate('/auth/login')} width={'size-3400'} variant={'secondary'}>Login</Button>
      </Flex>

    </View>
  )
}

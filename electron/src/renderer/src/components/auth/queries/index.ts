import {useMutation, useQueryClient} from "@tanstack/react-query";
import {request} from "../../../lib/request";
import {useStore} from "../../../hooks/use-store";
import {useNavigate} from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient()
  const [, setAccessToken] = useStore<string>('accessToken');
  const [, setRefreshToken] = useStore<string>('refreshToken');
  const navigate = useNavigate()

  return useMutation<{}, unknown, {email: string, password: string}, unknown>({
    async mutationFn (variables) {
      const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(variables)
      })

      if (!response.ok) {
        throw new Error("Something went wrong while login")
      }

      const tokens = await response.json()

      setAccessToken(tokens.accessToken)
      setRefreshToken(tokens.refreshToken)

      return tokens
    },
    async onSuccess () {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate('/')
    }
  })
}

export function useRegistration() {
  const navigate = useNavigate()
  return useMutation<{}, unknown, {email: string, password: string, name: string}, unknown>({
    async mutationFn (variables) {
      const response = await request('/auth/registration', {
        method: 'POST',
        body: JSON.stringify(variables)
      })

      if (!response.ok) {
        throw new Error("Something went wrong while registration")
      }

      return response.json()
    },
    onSuccess () {
      navigate('/')
    }
  })
}

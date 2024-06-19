import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {request} from "../lib/request";

export function useMe() {
  const navigate = useNavigate()
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await request('/users/me', {
        method: 'GET'
      })

      if (!response.ok) {
        navigate('/auth/login')
      }

      return response.json()
    },
    retry: false
  })
}

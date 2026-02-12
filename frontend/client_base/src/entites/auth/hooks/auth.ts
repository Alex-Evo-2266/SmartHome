import { useCallback, useEffect } from "react"
import { useMeAPI } from "../api/me"
import { useAppDispatch } from "@src/shared/lib/hooks/redux"
import {
  login,
  initAuth,
  logout,
} from "@src/shared/lib/reducers/userAuthDataReducer"

export const useGetAuth = () => {
  const { getMe } = useMeAPI()
  const dispatch = useAppDispatch()

  const getAuth = useCallback(async () => {
    try {
      const data = await getMe()
      if (data) {
        dispatch(login(data))
      } else {
        dispatch(logout())
      }
    } catch (e) {
      dispatch(logout())
    } finally {
      dispatch(initAuth())
    }
  }, [getMe, dispatch])

  useEffect(() => {
    getAuth()
  }, [getAuth])

  return { getAuth }
}

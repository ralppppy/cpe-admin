import React, { useEffect } from "react"
import AuthReducer from "../reducers/AuthReducer"
import axios from "axios"
import { message } from "antd"

const AuthContext = React.createContext()

const initialState = {
  authenticated: false,
  userData: {},
  loading: false,
}

function AuthProvider({ children }) {
  const [authState, authDispatch] = React.useReducer(AuthReducer, initialState)

  useEffect(() => {
    axios
      .post("/api/v1/auth")
      .then((_res) => {
        let { success, userData } = _res.data

        if (success) {
          authDispatch({ type: "AUTHENTICATE_USER", userData })
        } else {
          authDispatch({ type: "UNAUTHENTICATE_USER" })
        }
      })
      .catch((error) => {
        console.log(error)
        authDispatch({ type: "UNAUTHENTICATE_USER" })
      })
  }, [])

  const authenticate = (values, setIsValidating) => {
    setIsValidating(true)
    axios
      .post("/api/v1/auth/login", { ...values })
      .then((_res) => {
        let { success, userData } = _res.data

        if (success) {
          authDispatch({ type: "AUTHENTICATE_USER", userData })
          setIsValidating(false)
        } else {
          authDispatch({ type: "UNAUTHENTICATE_USER" })
          setIsValidating(false)
        }
      })
      .catch((error) => {
        console.log(error)

        message.error({ content: error.response.data.message, duration: 3 })
        setIsValidating(false)
      })
  }

  return (
    <AuthContext.Provider value={{ authState, authDispatch, authenticate }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }

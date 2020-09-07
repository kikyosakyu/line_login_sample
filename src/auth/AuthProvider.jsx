import React, {useEffect, useState} from 'react'
import {auth} from '../firebaseIndex'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged( async user => {
      if (user) {
        await setCurrentUser(user)
      } else {
        await setCurrentUser(null)
      }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

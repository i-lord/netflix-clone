import React from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import { useRouter } from 'next/router'
import { createContext, useEffect, useContext, useMemo, useState } from 'react'
import { auth } from '../firebase'

interface IAuth {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void> 
  error: string | null
  loading: boolean
  
}

const AuthContext = createContext<IAuth>({
    user: null,
    signUp: async () => {},
    signIn: async () => {},
    logOut: async () => {},
    error: null,
    loading: false,   
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null> (null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [initialLoading, setInitialLoading] = useState(true ) 
    const router = useRouter()

    // persisting the user
    useEffect (
      () =>
      onAuthStateChanged(auth, (user) =>{
        if(user) {
          // logged in
          setUser(user)
          setLoading(false)
        } else {
            // not logged in
            setUser (null)
            setLoading (true)
            router.push("/login")
          }
          setInitialLoading(false)
      }),
      [auth]
    )

    const signUp = async(email: string, password: string) => {
        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCrendetial) => {
            setUser(userCrendetial.user)
            router.push("/")
            setLoading(false)
        })
        .catch((error) => alert(error.message))
        .finally(()=> setLoading(false))
    }

    const signIn = async(email: string, password: string) => {
      setLoading(true)

      await signInWithEmailAndPassword(auth, email, password).then((userCrendetial) => {
          setUser(userCrendetial.user)
          router.push("/")
          setLoading(false)
      })
      .catch((error) => alert(error.message))
      .finally(()=> setLoading(false))
  }

  const logOut = async () => {
    setLoading(true)

    signOut(auth).then(() => {
      setUser(null)
    })
    .catch((error) => alert(error.message))
    .finally(()=> setLoading(false))
  }

    const memoedValue = useMemo(() =>({
      user, signUp, signIn, logOut, loading, error
    }),[user,loading])
  return (
  <AuthContext.Provider value={memoedValue}>
    {!initialLoading && children}
  </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
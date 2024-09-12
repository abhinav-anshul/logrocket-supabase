"use client"
import "./globals.css"
import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/utils/supabase"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <html lang="en">
      <body>
        <Navbar session={session} />
        {children}
        <Footer />
      </body>
    </html>
  )
}

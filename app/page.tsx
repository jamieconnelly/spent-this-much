'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import ExpenseForm from './components/ExpenseForm'
import SavedStatus, { SavedNotificationStatus } from './components/SavedStatus'

export default function Home() {
  useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    },
  })
  const [SavedNotificationState, setSavedNotificationState] = React.useState<{
    status: SavedNotificationStatus
    message?: string | undefined
  } | null>(null)
  const resetSavedNotificationState = () => setSavedNotificationState(null)
  return (
    <main className="m-8 flex flex-col items-center justify-center">
      {/* Add blue block to background */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-sky-100 -z-50"></div>
      {SavedNotificationState && (
        <SavedStatus
          state={SavedNotificationState}
          handleClose={resetSavedNotificationState}
        />
      )}
      <h1 className="mb-4 w-full max-w-screen-md mx-auto text-3xl font-black self-start">
        Spent This Much
      </h1>
      <ExpenseForm setSavedNotificationState={setSavedNotificationState} />
    </main>
  )
}

Home.requireAuth = true

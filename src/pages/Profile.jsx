import { useAuth } from '@/context/AuthContext'
import { Helmet } from 'react-helmet-async'

export default function Profile() {
  const { user } = useAuth()

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Welcome, {user?.fullName || 'User'}.
        </p>
      </div>
    </>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Profile() {
  const { user, logout, updateProfile, changePassword } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [profileLoading, setProfileLoading] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    if (!fullName.trim()) {
      toast.error('Full name is required.')
      return
    }

    setProfileLoading(true)
    try {
      await updateProfile(fullName.trim())
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill in all password fields.')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setPasswordLoading(true)
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmNewPassword
      )
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    } catch (err) {
      toast.error(err?.message || 'Failed to change password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Profile | ETFARAG</title>
        </Helmet>
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Could not load your profile. Please try logging in again.
          </p>
          <Button className="mt-6" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Profile | ETFARAG</title>
      </Helmet>
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold">
                {getInitials(user.fullName)}
              </div>
            </div>
            <CardTitle className="text-2xl">{user.fullName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Account Information
              </h2>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Account Status</p>
                <p className="text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Edit Profile
              </h2>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                aria-label="Full name"
              />
              <Button type="submit" className="w-full" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Change Password
              </h2>
              <Input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                aria-label="Current password"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                aria-label="New password"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))
                }
                aria-label="Confirm new password"
              />
              <Button type="submit" className="w-full" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </form>

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

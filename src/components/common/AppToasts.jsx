import { ToastContainer } from 'react-toastify'
import { useTheme } from '@/context/ThemeContext'

export default function AppToasts() {
  const { theme } = useTheme()

  return (
    <ToastContainer
      position="top-right"
      theme={theme === 'dark' ? 'dark' : 'light'}
    />
  )
}

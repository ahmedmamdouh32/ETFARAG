import { useState } from 'react'
import { Link, NavLink, useNavigate, createSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useFavorites } from '@/context/FavoritesContext'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const { favoriteCount } = useFavorites()
  const navigate = useNavigate()

  const publicLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/search', label: t('nav.search') },
  ]

  const authLinks = isAuthenticated
    ? [
        { to: '/favorites', label: `${t('nav.favorites')} (${favoriteCount})` },
        { to: '/profile', label: t('nav.profile') },
      ]
    : [
        { to: '/login', label: t('nav.login') },
        { to: '/register', label: t('nav.register') },
      ]

  const navLinks = [...publicLinks, ...authLinks]

  function handleLogout() {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  function handleLanguageChange(e) {
    i18n.changeLanguage(e.target.value)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" aria-label="ETFARAG home">
            <img src="/logo.webp" alt="" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const q = formData.get('navbar-search')
                if (q?.trim()) {
                  navigate({
                    pathname: '/search',
                    search: createSearchParams({ q: q.trim() }).toString(),
                  })
                }
              }}
            >
              <input
                name="navbar-search"
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 lg:w-48"
                aria-label={t('nav.searchPlaceholder')}
              />
            </form>
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="px-2 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('nav.language')}
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">{user?.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label={t('nav.logout')}
                >
                  {t('nav.logout')}
                </button>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('nav.toggleTheme')}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={t('nav.toggleMenu')}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const q = formData.get('mobile-search')
                if (q?.trim()) {
                  navigate({
                    pathname: '/search',
                    search: createSearchParams({ q: q.trim() }).toString(),
                  })
                }
                setIsOpen(false)
              }}
              className="px-3 py-2"
            >
              <input
                name="mobile-search"
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t('nav.searchPlaceholder')}
              />
            </form>
            <div className="px-3 py-2">
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t('nav.language')}
              >
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
            </div>
            {isAuthenticated && (
              <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{user?.fullName}</div>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                aria-label={t('nav.logout')}
              >
                {t('nav.logout')}
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label={t('nav.toggleTheme')}
            >
              {theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

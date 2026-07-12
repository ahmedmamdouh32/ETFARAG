import { useTranslation } from 'react-i18next'

const sortOptionKeys = [
  { value: 'popularity.desc', labelKey: 'sort.popularityDesc' },
  { value: 'popularity.asc', labelKey: 'sort.popularityAsc' },
  { value: 'vote_average.desc', labelKey: 'sort.ratingDesc' },
  { value: 'vote_average.asc', labelKey: 'sort.ratingAsc' },
  { value: 'primary_release_date.desc', labelKey: 'sort.dateDesc' },
  { value: 'primary_release_date.asc', labelKey: 'sort.dateAsc' },
]

export default function SortDropdown({ value, onChange }) {
  const { t } = useTranslation()

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={t('common.sortMovies')}
    >
      {sortOptionKeys.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.labelKey)}
        </option>
      ))}
    </select>
  )
}

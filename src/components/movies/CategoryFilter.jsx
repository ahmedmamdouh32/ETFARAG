import { useTranslation } from 'react-i18next'

export default function CategoryFilter({ categories, selected, onSelect }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t('common.filterByCategory')}>
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === ''
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-pressed={selected === ''}
      >
        {t('common.all')}
      </button>
      {categories.map((cat) => (
        <button
          type="button"
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            String(selected) === String(cat.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-pressed={String(selected) === String(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

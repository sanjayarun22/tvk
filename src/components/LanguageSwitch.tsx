import { useStore } from '@nanostores/react';
import { currentLanguage, type Language } from '../lib/store/languageStore';

export default function LanguageSwitch() {
  const $language = useStore(currentLanguage);

  const toggleLanguage = () => {
    currentLanguage.set($language === 'tamil' ? 'english' : 'tamil');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 bg-secondary text-primary rounded-md hover:bg-yellow-400 transition-colors"
    >
      {$language === 'tamil' ? 'English' : 'தமிழ்'}
    </button>
  );
}
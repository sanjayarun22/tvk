import { atom } from 'nanostores';

export type Language = 'tamil' | 'english';
export const currentLanguage = atom<Language>('tamil');
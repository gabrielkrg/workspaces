import { usePage } from '@inertiajs/vue3';
import { SharedData } from '@/types';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

export function useTranslation() {
    const { translations, locale } = usePage<SharedData>().props;

    const t = (key: TranslationKey, params?: TranslationParams): string => {
        const keys = key.split('.');
        let value: string | SharedData['translations'] | undefined = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        if (params) {
            return Object.entries(params).reduce(
                (text, [paramKey, paramValue]) =>
                    text.replace(`:${paramKey}`, String(paramValue)),
                value
            );
        }

        return value;
    };

    return { t, locale };
}

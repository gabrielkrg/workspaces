<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $locale = $this->detectLocale($request);
        $translations = $this->loadTranslations($locale);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => fn() => $request->user()?->load('workspaces', 'workspace'),
            ],
            'workspaceTimezone' => fn() => $request->user()?->workspace?->time_zone ?? config('app.timezone'),
            'ziggy' => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => $locale,
            'translations' => $translations,
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Detect the user's preferred locale.
     */
    protected function detectLocale(Request $request): string
    {
        // Change this value to set the default language: 'pt_BR' or 'en'
        $defaultLocale = 'pt_BR';

        $supportedLocales = ['pt_BR', 'en'];

        // Check if user has a preferred locale stored
        if ($request->user() && isset($request->user()->locale)) {
            $userLocale = $request->user()->locale;
            if (in_array($userLocale, $supportedLocales)) {
                return $userLocale;
            }
        }

        // Check Accept-Language header
        foreach ($request->getLanguages() as $language) {
            $locale = str_replace('-', '_', $language);

            // Normalize format (pt-br -> pt_BR)
            if (str_contains($locale, '_')) {
                $parts = explode('_', $locale);
                if (count($parts) === 2) {
                    $locale = strtolower($parts[0]) . '_' . strtoupper($parts[1]);
                }
            }

            // Exact match
            if (in_array($locale, $supportedLocales)) {
                return $locale;
            }

            // Prefix match (pt -> pt_BR)
            $langPrefix = strtolower(explode('_', $locale)[0]);
            if ($langPrefix === 'pt') {
                return 'pt_BR';
            }
        }

        return $defaultLocale;
    }

    /**
     * Load translations for the given locale.
     */
    protected function loadTranslations(string $locale): array
    {
        $path = lang_path("{$locale}.php");

        if (file_exists($path)) {
            return require $path;
        }

        // Fallback to English if translation file doesn't exist
        $fallbackPath = lang_path('en.php');
        if (file_exists($fallbackPath)) {
            return require $fallbackPath;
        }

        return [];
    }
}

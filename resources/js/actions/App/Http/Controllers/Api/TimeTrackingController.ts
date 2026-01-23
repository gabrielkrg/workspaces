import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TimeTrackingController::active
* @see app/Http/Controllers/Api/TimeTrackingController.php:29
* @route '/api/time-tracking/active'
*/
export const active = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: active.url(options),
    method: 'get',
})

active.definition = {
    methods: ["get","head"],
    url: '/api/time-tracking/active',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::active
* @see app/Http/Controllers/Api/TimeTrackingController.php:29
* @route '/api/time-tracking/active'
*/
active.url = (options?: RouteQueryOptions) => {
    return active.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::active
* @see app/Http/Controllers/Api/TimeTrackingController.php:29
* @route '/api/time-tracking/active'
*/
active.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: active.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::active
* @see app/Http/Controllers/Api/TimeTrackingController.php:29
* @route '/api/time-tracking/active'
*/
active.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: active.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::active
* @see app/Http/Controllers/Api/TimeTrackingController.php:29
* @route '/api/time-tracking/active'
*/
const activeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: active.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::active
* @see app/Http/Controllers/Api/TimeTrackingController.php:29
* @route '/api/time-tracking/active'
*/
activeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: active.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::active
* @see app/Http/Controllers/Api/TimeTrackingController.php:29
* @route '/api/time-tracking/active'
*/
activeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: active.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

active.form = activeForm

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::stats
* @see app/Http/Controllers/Api/TimeTrackingController.php:171
* @route '/api/time-tracking/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/time-tracking/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::stats
* @see app/Http/Controllers/Api/TimeTrackingController.php:171
* @route '/api/time-tracking/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::stats
* @see app/Http/Controllers/Api/TimeTrackingController.php:171
* @route '/api/time-tracking/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::stats
* @see app/Http/Controllers/Api/TimeTrackingController.php:171
* @route '/api/time-tracking/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::stats
* @see app/Http/Controllers/Api/TimeTrackingController.php:171
* @route '/api/time-tracking/stats'
*/
const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::stats
* @see app/Http/Controllers/Api/TimeTrackingController.php:171
* @route '/api/time-tracking/stats'
*/
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::stats
* @see app/Http/Controllers/Api/TimeTrackingController.php:171
* @route '/api/time-tracking/stats'
*/
statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stats.form = statsForm

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackables
* @see app/Http/Controllers/Api/TimeTrackingController.php:51
* @route '/api/time-tracking/trackables'
*/
export const trackables = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trackables.url(options),
    method: 'get',
})

trackables.definition = {
    methods: ["get","head"],
    url: '/api/time-tracking/trackables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackables
* @see app/Http/Controllers/Api/TimeTrackingController.php:51
* @route '/api/time-tracking/trackables'
*/
trackables.url = (options?: RouteQueryOptions) => {
    return trackables.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackables
* @see app/Http/Controllers/Api/TimeTrackingController.php:51
* @route '/api/time-tracking/trackables'
*/
trackables.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trackables.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackables
* @see app/Http/Controllers/Api/TimeTrackingController.php:51
* @route '/api/time-tracking/trackables'
*/
trackables.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trackables.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackables
* @see app/Http/Controllers/Api/TimeTrackingController.php:51
* @route '/api/time-tracking/trackables'
*/
const trackablesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trackables.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackables
* @see app/Http/Controllers/Api/TimeTrackingController.php:51
* @route '/api/time-tracking/trackables'
*/
trackablesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trackables.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackables
* @see app/Http/Controllers/Api/TimeTrackingController.php:51
* @route '/api/time-tracking/trackables'
*/
trackablesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trackables.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

trackables.form = trackablesForm

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackablesTypes
* @see app/Http/Controllers/Api/TimeTrackingController.php:19
* @route '/api/time-tracking/trackables-types'
*/
export const trackablesTypes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trackablesTypes.url(options),
    method: 'get',
})

trackablesTypes.definition = {
    methods: ["get","head"],
    url: '/api/time-tracking/trackables-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackablesTypes
* @see app/Http/Controllers/Api/TimeTrackingController.php:19
* @route '/api/time-tracking/trackables-types'
*/
trackablesTypes.url = (options?: RouteQueryOptions) => {
    return trackablesTypes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackablesTypes
* @see app/Http/Controllers/Api/TimeTrackingController.php:19
* @route '/api/time-tracking/trackables-types'
*/
trackablesTypes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trackablesTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackablesTypes
* @see app/Http/Controllers/Api/TimeTrackingController.php:19
* @route '/api/time-tracking/trackables-types'
*/
trackablesTypes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trackablesTypes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackablesTypes
* @see app/Http/Controllers/Api/TimeTrackingController.php:19
* @route '/api/time-tracking/trackables-types'
*/
const trackablesTypesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trackablesTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackablesTypes
* @see app/Http/Controllers/Api/TimeTrackingController.php:19
* @route '/api/time-tracking/trackables-types'
*/
trackablesTypesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trackablesTypes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::trackablesTypes
* @see app/Http/Controllers/Api/TimeTrackingController.php:19
* @route '/api/time-tracking/trackables-types'
*/
trackablesTypesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trackablesTypes.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

trackablesTypes.form = trackablesTypesForm

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::start
* @see app/Http/Controllers/Api/TimeTrackingController.php:85
* @route '/api/time-tracking/start'
*/
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/api/time-tracking/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::start
* @see app/Http/Controllers/Api/TimeTrackingController.php:85
* @route '/api/time-tracking/start'
*/
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::start
* @see app/Http/Controllers/Api/TimeTrackingController.php:85
* @route '/api/time-tracking/start'
*/
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::start
* @see app/Http/Controllers/Api/TimeTrackingController.php:85
* @route '/api/time-tracking/start'
*/
const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::start
* @see app/Http/Controllers/Api/TimeTrackingController.php:85
* @route '/api/time-tracking/start'
*/
startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::pause
* @see app/Http/Controllers/Api/TimeTrackingController.php:117
* @route '/api/time-tracking/{timeTracking}/pause'
*/
export const pause = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

pause.definition = {
    methods: ["post"],
    url: '/api/time-tracking/{timeTracking}/pause',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::pause
* @see app/Http/Controllers/Api/TimeTrackingController.php:117
* @route '/api/time-tracking/{timeTracking}/pause'
*/
pause.url = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timeTracking: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { timeTracking: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            timeTracking: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        timeTracking: typeof args.timeTracking === 'object'
        ? args.timeTracking.id
        : args.timeTracking,
    }

    return pause.definition.url
            .replace('{timeTracking}', parsedArgs.timeTracking.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::pause
* @see app/Http/Controllers/Api/TimeTrackingController.php:117
* @route '/api/time-tracking/{timeTracking}/pause'
*/
pause.post = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::pause
* @see app/Http/Controllers/Api/TimeTrackingController.php:117
* @route '/api/time-tracking/{timeTracking}/pause'
*/
const pauseForm = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pause.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::pause
* @see app/Http/Controllers/Api/TimeTrackingController.php:117
* @route '/api/time-tracking/{timeTracking}/pause'
*/
pauseForm.post = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pause.url(args, options),
    method: 'post',
})

pause.form = pauseForm

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::resume
* @see app/Http/Controllers/Api/TimeTrackingController.php:136
* @route '/api/time-tracking/{timeTracking}/resume'
*/
export const resume = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/api/time-tracking/{timeTracking}/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::resume
* @see app/Http/Controllers/Api/TimeTrackingController.php:136
* @route '/api/time-tracking/{timeTracking}/resume'
*/
resume.url = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timeTracking: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { timeTracking: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            timeTracking: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        timeTracking: typeof args.timeTracking === 'object'
        ? args.timeTracking.id
        : args.timeTracking,
    }

    return resume.definition.url
            .replace('{timeTracking}', parsedArgs.timeTracking.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::resume
* @see app/Http/Controllers/Api/TimeTrackingController.php:136
* @route '/api/time-tracking/{timeTracking}/resume'
*/
resume.post = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::resume
* @see app/Http/Controllers/Api/TimeTrackingController.php:136
* @route '/api/time-tracking/{timeTracking}/resume'
*/
const resumeForm = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TimeTrackingController::resume
* @see app/Http/Controllers/Api/TimeTrackingController.php:136
* @route '/api/time-tracking/{timeTracking}/resume'
*/
resumeForm.post = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resume.url(args, options),
    method: 'post',
})

resume.form = resumeForm

const TimeTrackingController = { active, stats, trackables, trackablesTypes, start, pause, resume }

export default TimeTrackingController
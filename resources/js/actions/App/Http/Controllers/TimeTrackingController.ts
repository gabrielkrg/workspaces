import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TimeTrackingController::index
* @see app/Http/Controllers/TimeTrackingController.php:17
* @route '/time-tracking'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/time-tracking',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimeTrackingController::index
* @see app/Http/Controllers/TimeTrackingController.php:17
* @route '/time-tracking'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeTrackingController::index
* @see app/Http/Controllers/TimeTrackingController.php:17
* @route '/time-tracking'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::index
* @see app/Http/Controllers/TimeTrackingController.php:17
* @route '/time-tracking'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::index
* @see app/Http/Controllers/TimeTrackingController.php:17
* @route '/time-tracking'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::index
* @see app/Http/Controllers/TimeTrackingController.php:17
* @route '/time-tracking'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::index
* @see app/Http/Controllers/TimeTrackingController.php:17
* @route '/time-tracking'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\TimeTrackingController::store
* @see app/Http/Controllers/TimeTrackingController.php:38
* @route '/time-tracking'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/time-tracking',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimeTrackingController::store
* @see app/Http/Controllers/TimeTrackingController.php:38
* @route '/time-tracking'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeTrackingController::store
* @see app/Http/Controllers/TimeTrackingController.php:38
* @route '/time-tracking'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::store
* @see app/Http/Controllers/TimeTrackingController.php:38
* @route '/time-tracking'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::store
* @see app/Http/Controllers/TimeTrackingController.php:38
* @route '/time-tracking'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TimeTrackingController::update
* @see app/Http/Controllers/TimeTrackingController.php:80
* @route '/time-tracking/{timeTracking}'
*/
export const update = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/time-tracking/{timeTracking}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TimeTrackingController::update
* @see app/Http/Controllers/TimeTrackingController.php:80
* @route '/time-tracking/{timeTracking}'
*/
update.url = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{timeTracking}', parsedArgs.timeTracking.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeTrackingController::update
* @see app/Http/Controllers/TimeTrackingController.php:80
* @route '/time-tracking/{timeTracking}'
*/
update.put = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::update
* @see app/Http/Controllers/TimeTrackingController.php:80
* @route '/time-tracking/{timeTracking}'
*/
const updateForm = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::update
* @see app/Http/Controllers/TimeTrackingController.php:80
* @route '/time-tracking/{timeTracking}'
*/
updateForm.put = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\TimeTrackingController::destroy
* @see app/Http/Controllers/TimeTrackingController.php:111
* @route '/time-tracking/{timeTracking}'
*/
export const destroy = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/time-tracking/{timeTracking}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TimeTrackingController::destroy
* @see app/Http/Controllers/TimeTrackingController.php:111
* @route '/time-tracking/{timeTracking}'
*/
destroy.url = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{timeTracking}', parsedArgs.timeTracking.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeTrackingController::destroy
* @see app/Http/Controllers/TimeTrackingController.php:111
* @route '/time-tracking/{timeTracking}'
*/
destroy.delete = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::destroy
* @see app/Http/Controllers/TimeTrackingController.php:111
* @route '/time-tracking/{timeTracking}'
*/
const destroyForm = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::destroy
* @see app/Http/Controllers/TimeTrackingController.php:111
* @route '/time-tracking/{timeTracking}'
*/
destroyForm.delete = (args: { timeTracking: string | number | { id: string | number } } | [timeTracking: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\TimeTrackingController::start
* @see app/Http/Controllers/TimeTrackingController.php:124
* @route '/time-tracking/start'
*/
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/time-tracking/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimeTrackingController::start
* @see app/Http/Controllers/TimeTrackingController.php:124
* @route '/time-tracking/start'
*/
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeTrackingController::start
* @see app/Http/Controllers/TimeTrackingController.php:124
* @route '/time-tracking/start'
*/
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::start
* @see app/Http/Controllers/TimeTrackingController.php:124
* @route '/time-tracking/start'
*/
const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeTrackingController::start
* @see app/Http/Controllers/TimeTrackingController.php:124
* @route '/time-tracking/start'
*/
startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

start.form = startForm

const TimeTrackingController = { index, store, update, destroy, start }

export default TimeTrackingController
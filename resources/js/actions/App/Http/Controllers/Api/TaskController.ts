import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TaskController::heatmap
* @see app/Http/Controllers/Api/TaskController.php:12
* @route '/api/tasks/heatmap'
*/
export const heatmap = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heatmap.url(options),
    method: 'get',
})

heatmap.definition = {
    methods: ["get","head"],
    url: '/api/tasks/heatmap',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TaskController::heatmap
* @see app/Http/Controllers/Api/TaskController.php:12
* @route '/api/tasks/heatmap'
*/
heatmap.url = (options?: RouteQueryOptions) => {
    return heatmap.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TaskController::heatmap
* @see app/Http/Controllers/Api/TaskController.php:12
* @route '/api/tasks/heatmap'
*/
heatmap.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heatmap.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::heatmap
* @see app/Http/Controllers/Api/TaskController.php:12
* @route '/api/tasks/heatmap'
*/
heatmap.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: heatmap.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TaskController::heatmap
* @see app/Http/Controllers/Api/TaskController.php:12
* @route '/api/tasks/heatmap'
*/
const heatmapForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: heatmap.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::heatmap
* @see app/Http/Controllers/Api/TaskController.php:12
* @route '/api/tasks/heatmap'
*/
heatmapForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: heatmap.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::heatmap
* @see app/Http/Controllers/Api/TaskController.php:12
* @route '/api/tasks/heatmap'
*/
heatmapForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: heatmap.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

heatmap.form = heatmapForm

/**
* @see \App\Http\Controllers\Api\TaskController::latestChanges
* @see app/Http/Controllers/Api/TaskController.php:32
* @route '/api/tasks/latest'
*/
export const latestChanges = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latestChanges.url(options),
    method: 'get',
})

latestChanges.definition = {
    methods: ["get","head"],
    url: '/api/tasks/latest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TaskController::latestChanges
* @see app/Http/Controllers/Api/TaskController.php:32
* @route '/api/tasks/latest'
*/
latestChanges.url = (options?: RouteQueryOptions) => {
    return latestChanges.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TaskController::latestChanges
* @see app/Http/Controllers/Api/TaskController.php:32
* @route '/api/tasks/latest'
*/
latestChanges.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latestChanges.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::latestChanges
* @see app/Http/Controllers/Api/TaskController.php:32
* @route '/api/tasks/latest'
*/
latestChanges.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: latestChanges.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TaskController::latestChanges
* @see app/Http/Controllers/Api/TaskController.php:32
* @route '/api/tasks/latest'
*/
const latestChangesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latestChanges.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::latestChanges
* @see app/Http/Controllers/Api/TaskController.php:32
* @route '/api/tasks/latest'
*/
latestChangesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latestChanges.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TaskController::latestChanges
* @see app/Http/Controllers/Api/TaskController.php:32
* @route '/api/tasks/latest'
*/
latestChangesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latestChanges.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

latestChanges.form = latestChangesForm

const TaskController = { heatmap, latestChanges }

export default TaskController
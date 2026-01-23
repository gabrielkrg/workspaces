import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\WorkspaceController::tasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
export const tasks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tasks.url(options),
    method: 'get',
})

tasks.definition = {
    methods: ["get","head"],
    url: '/api/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkspaceController::tasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
tasks.url = (options?: RouteQueryOptions) => {
    return tasks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkspaceController::tasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
tasks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tasks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::tasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
tasks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tasks.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::tasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
const tasksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::tasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
tasksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::tasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
tasksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasks.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tasks.form = tasksForm

const workspace = {
    tasks: Object.assign(tasks, tasks),
}

export default workspace
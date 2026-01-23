import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\WorkspaceController::index
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/workspaces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkspaceController::index
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkspaceController::index
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::index
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::index
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::index
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::index
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
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
* @see \App\Http\Controllers\Api\WorkspaceController::getWorkspaceTasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
export const getWorkspaceTasks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getWorkspaceTasks.url(options),
    method: 'get',
})

getWorkspaceTasks.definition = {
    methods: ["get","head"],
    url: '/api/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkspaceController::getWorkspaceTasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
getWorkspaceTasks.url = (options?: RouteQueryOptions) => {
    return getWorkspaceTasks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkspaceController::getWorkspaceTasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
getWorkspaceTasks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getWorkspaceTasks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::getWorkspaceTasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
getWorkspaceTasks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getWorkspaceTasks.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::getWorkspaceTasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
const getWorkspaceTasksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getWorkspaceTasks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::getWorkspaceTasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
getWorkspaceTasksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getWorkspaceTasks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::getWorkspaceTasks
* @see app/Http/Controllers/Api/WorkspaceController.php:21
* @route '/api/tasks'
*/
getWorkspaceTasksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getWorkspaceTasks.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getWorkspaceTasks.form = getWorkspaceTasksForm

const WorkspaceController = { index, getWorkspaceTasks }

export default WorkspaceController
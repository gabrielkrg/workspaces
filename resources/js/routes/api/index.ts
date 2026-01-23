import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import workspace from './workspace'
import timeTracking from './time-tracking'
/**
* @see \App\Http\Controllers\Api\WorkspaceController::workspaces
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
export const workspaces = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspaces.url(options),
    method: 'get',
})

workspaces.definition = {
    methods: ["get","head"],
    url: '/api/workspaces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkspaceController::workspaces
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
workspaces.url = (options?: RouteQueryOptions) => {
    return workspaces.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkspaceController::workspaces
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
workspaces.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspaces.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::workspaces
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
workspaces.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workspaces.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::workspaces
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
const workspacesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspaces.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::workspaces
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
workspacesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspaces.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceController::workspaces
* @see app/Http/Controllers/Api/WorkspaceController.php:13
* @route '/api/workspaces'
*/
workspacesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspaces.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

workspaces.form = workspacesForm

/**
* @see \App\Http\Controllers\Api\TagController::tags
* @see app/Http/Controllers/Api/TagController.php:15
* @route '/api/tags'
*/
export const tags = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tags.url(options),
    method: 'get',
})

tags.definition = {
    methods: ["get","head"],
    url: '/api/tags',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TagController::tags
* @see app/Http/Controllers/Api/TagController.php:15
* @route '/api/tags'
*/
tags.url = (options?: RouteQueryOptions) => {
    return tags.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TagController::tags
* @see app/Http/Controllers/Api/TagController.php:15
* @route '/api/tags'
*/
tags.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tags.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TagController::tags
* @see app/Http/Controllers/Api/TagController.php:15
* @route '/api/tags'
*/
tags.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tags.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TagController::tags
* @see app/Http/Controllers/Api/TagController.php:15
* @route '/api/tags'
*/
const tagsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tags.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TagController::tags
* @see app/Http/Controllers/Api/TagController.php:15
* @route '/api/tags'
*/
tagsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tags.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TagController::tags
* @see app/Http/Controllers/Api/TagController.php:15
* @route '/api/tags'
*/
tagsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tags.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tags.form = tagsForm

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
export const generateWithAi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateWithAi.url(options),
    method: 'post',
})

generateWithAi.definition = {
    methods: ["post"],
    url: '/api/generate-with-ai',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
generateWithAi.url = (options?: RouteQueryOptions) => {
    return generateWithAi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
generateWithAi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateWithAi.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
const generateWithAiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateWithAi.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
generateWithAiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateWithAi.url(options),
    method: 'post',
})

generateWithAi.form = generateWithAiForm

const api = {
    workspaces: Object.assign(workspaces, workspaces),
    workspace: Object.assign(workspace, workspace),
    timeTracking: Object.assign(timeTracking, timeTracking),
    tags: Object.assign(tags, tags),
    generateWithAi: Object.assign(generateWithAi, generateWithAi),
}

export default api
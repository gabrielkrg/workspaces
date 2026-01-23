import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\WorkspaceController::screen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
export const screen = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: screen.url(args, options),
    method: 'get',
})

screen.definition = {
    methods: ["get","head"],
    url: '/workspace/invite/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::screen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
screen.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return screen.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::screen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
screen.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: screen.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::screen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
screen.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: screen.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::screen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
const screenForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: screen.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::screen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
screenForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: screen.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::screen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
screenForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: screen.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

screen.form = screenForm

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::accept
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
export const accept = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})

accept.definition = {
    methods: ["get","head"],
    url: '/workspace/invite-accept/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::accept
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
accept.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return accept.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::accept
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
accept.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::accept
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
accept.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accept.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::accept
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
const acceptForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: accept.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::accept
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
acceptForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: accept.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::accept
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
acceptForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: accept.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

accept.form = acceptForm

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generate
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
export const generate = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(args, options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/settings/workspaces/{workspace}/invite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generate
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
generate.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return generate.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generate
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
generate.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generate
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
const generateForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generate
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
generateForm.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generate.url(args, options),
    method: 'post',
})

generate.form = generateForm

const invite = {
    screen: Object.assign(screen, screen),
    accept: Object.assign(accept, accept),
    generate: Object.assign(generate, generate),
}

export default invite
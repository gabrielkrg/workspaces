import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
* @see app/Http/Controllers/Settings/WorkspaceController.php:18
* @route '/settings/workspace'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/workspace',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
* @see app/Http/Controllers/Settings/WorkspaceController.php:18
* @route '/settings/workspace'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
* @see app/Http/Controllers/Settings/WorkspaceController.php:18
* @route '/settings/workspace'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
* @see app/Http/Controllers/Settings/WorkspaceController.php:18
* @route '/settings/workspace'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
* @see app/Http/Controllers/Settings/WorkspaceController.php:18
* @route '/settings/workspace'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
* @see app/Http/Controllers/Settings/WorkspaceController.php:18
* @route '/settings/workspace'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
* @see app/Http/Controllers/Settings/WorkspaceController.php:18
* @route '/settings/workspace'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::store
* @see app/Http/Controllers/Settings/WorkspaceController.php:29
* @route '/settings/workspace'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/workspace',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::store
* @see app/Http/Controllers/Settings/WorkspaceController.php:29
* @route '/settings/workspace'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::store
* @see app/Http/Controllers/Settings/WorkspaceController.php:29
* @route '/settings/workspace'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::store
* @see app/Http/Controllers/Settings/WorkspaceController.php:29
* @route '/settings/workspace'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::store
* @see app/Http/Controllers/Settings/WorkspaceController.php:29
* @route '/settings/workspace'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
* @see app/Http/Controllers/Settings/WorkspaceController.php:51
* @route '/settings/workspace/{workspace}'
*/
export const update = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/workspace/{workspace}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
* @see app/Http/Controllers/Settings/WorkspaceController.php:51
* @route '/settings/workspace/{workspace}'
*/
update.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
* @see app/Http/Controllers/Settings/WorkspaceController.php:51
* @route '/settings/workspace/{workspace}'
*/
update.put = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
* @see app/Http/Controllers/Settings/WorkspaceController.php:51
* @route '/settings/workspace/{workspace}'
*/
const updateForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
* @see app/Http/Controllers/Settings/WorkspaceController.php:51
* @route '/settings/workspace/{workspace}'
*/
updateForm.put = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\WorkspaceController::destroy
* @see app/Http/Controllers/Settings/WorkspaceController.php:146
* @route '/settings/workspace/{workspace}'
*/
export const destroy = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/workspace/{workspace}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::destroy
* @see app/Http/Controllers/Settings/WorkspaceController.php:146
* @route '/settings/workspace/{workspace}'
*/
destroy.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::destroy
* @see app/Http/Controllers/Settings/WorkspaceController.php:146
* @route '/settings/workspace/{workspace}'
*/
destroy.delete = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::destroy
* @see app/Http/Controllers/Settings/WorkspaceController.php:146
* @route '/settings/workspace/{workspace}'
*/
const destroyForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::destroy
* @see app/Http/Controllers/Settings/WorkspaceController.php:146
* @route '/settings/workspace/{workspace}'
*/
destroyForm.delete = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\WorkspaceController::set
* @see app/Http/Controllers/Settings/WorkspaceController.php:89
* @route '/settings/workspace/set'
*/
export const set = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: set.url(options),
    method: 'patch',
})

set.definition = {
    methods: ["patch"],
    url: '/settings/workspace/set',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::set
* @see app/Http/Controllers/Settings/WorkspaceController.php:89
* @route '/settings/workspace/set'
*/
set.url = (options?: RouteQueryOptions) => {
    return set.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::set
* @see app/Http/Controllers/Settings/WorkspaceController.php:89
* @route '/settings/workspace/set'
*/
set.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: set.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::set
* @see app/Http/Controllers/Settings/WorkspaceController.php:89
* @route '/settings/workspace/set'
*/
const setForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: set.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::set
* @see app/Http/Controllers/Settings/WorkspaceController.php:89
* @route '/settings/workspace/set'
*/
setForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: set.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

set.form = setForm

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::inviteScreen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
export const inviteScreen = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inviteScreen.url(args, options),
    method: 'get',
})

inviteScreen.definition = {
    methods: ["get","head"],
    url: '/workspace/invite/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::inviteScreen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
inviteScreen.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return inviteScreen.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::inviteScreen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
inviteScreen.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: inviteScreen.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::inviteScreen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
inviteScreen.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: inviteScreen.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::inviteScreen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
const inviteScreenForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: inviteScreen.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::inviteScreen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
inviteScreenForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: inviteScreen.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::inviteScreen
* @see app/Http/Controllers/Settings/WorkspaceController.php:116
* @route '/workspace/invite/{token}'
*/
inviteScreenForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: inviteScreen.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

inviteScreen.form = inviteScreenForm

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::acceptInvite
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
export const acceptInvite = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: acceptInvite.url(args, options),
    method: 'get',
})

acceptInvite.definition = {
    methods: ["get","head"],
    url: '/workspace/invite-accept/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::acceptInvite
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
acceptInvite.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return acceptInvite.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::acceptInvite
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
acceptInvite.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: acceptInvite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::acceptInvite
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
acceptInvite.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: acceptInvite.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::acceptInvite
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
const acceptInviteForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acceptInvite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::acceptInvite
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
acceptInviteForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acceptInvite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::acceptInvite
* @see app/Http/Controllers/Settings/WorkspaceController.php:127
* @route '/workspace/invite-accept/{token}'
*/
acceptInviteForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acceptInvite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

acceptInvite.form = acceptInviteForm

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generateInviteLink
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
export const generateInviteLink = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateInviteLink.url(args, options),
    method: 'post',
})

generateInviteLink.definition = {
    methods: ["post"],
    url: '/settings/workspaces/{workspace}/invite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generateInviteLink
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
generateInviteLink.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return generateInviteLink.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generateInviteLink
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
generateInviteLink.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateInviteLink.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generateInviteLink
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
const generateInviteLinkForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateInviteLink.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::generateInviteLink
* @see app/Http/Controllers/Settings/WorkspaceController.php:101
* @route '/settings/workspaces/{workspace}/invite'
*/
generateInviteLinkForm.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateInviteLink.url(args, options),
    method: 'post',
})

generateInviteLink.form = generateInviteLinkForm

const WorkspaceController = { edit, store, update, destroy, set, inviteScreen, acceptInvite, generateInviteLink }

export default WorkspaceController
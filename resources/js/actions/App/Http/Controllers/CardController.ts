import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CardController::store
* @see app/Http/Controllers/CardController.php:51
* @route '/cards/{kanban}'
*/
export const store = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cards/{kanban}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CardController::store
* @see app/Http/Controllers/CardController.php:51
* @route '/cards/{kanban}'
*/
store.url = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kanban: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { kanban: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            kanban: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        kanban: typeof args.kanban === 'object'
        ? args.kanban.id
        : args.kanban,
    }

    return store.definition.url
            .replace('{kanban}', parsedArgs.kanban.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CardController::store
* @see app/Http/Controllers/CardController.php:51
* @route '/cards/{kanban}'
*/
store.post = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::store
* @see app/Http/Controllers/CardController.php:51
* @route '/cards/{kanban}'
*/
const storeForm = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::store
* @see app/Http/Controllers/CardController.php:51
* @route '/cards/{kanban}'
*/
storeForm.post = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CardController::update
* @see app/Http/Controllers/CardController.php:85
* @route '/cards/{card}'
*/
export const update = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/cards/{card}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CardController::update
* @see app/Http/Controllers/CardController.php:85
* @route '/cards/{card}'
*/
update.url = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { card: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { card: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            card: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        card: typeof args.card === 'object'
        ? args.card.id
        : args.card,
    }

    return update.definition.url
            .replace('{card}', parsedArgs.card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CardController::update
* @see app/Http/Controllers/CardController.php:85
* @route '/cards/{card}'
*/
update.put = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CardController::update
* @see app/Http/Controllers/CardController.php:85
* @route '/cards/{card}'
*/
const updateForm = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::update
* @see app/Http/Controllers/CardController.php:85
* @route '/cards/{card}'
*/
updateForm.put = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CardController::deleteMethod
* @see app/Http/Controllers/CardController.php:129
* @route '/cards/{card}'
*/
export const deleteMethod = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/cards/{card}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CardController::deleteMethod
* @see app/Http/Controllers/CardController.php:129
* @route '/cards/{card}'
*/
deleteMethod.url = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { card: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { card: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            card: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        card: typeof args.card === 'object'
        ? args.card.id
        : args.card,
    }

    return deleteMethod.definition.url
            .replace('{card}', parsedArgs.card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CardController::deleteMethod
* @see app/Http/Controllers/CardController.php:129
* @route '/cards/{card}'
*/
deleteMethod.delete = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CardController::deleteMethod
* @see app/Http/Controllers/CardController.php:129
* @route '/cards/{card}'
*/
const deleteMethodForm = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::deleteMethod
* @see app/Http/Controllers/CardController.php:129
* @route '/cards/{card}'
*/
deleteMethodForm.delete = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteMethod.form = deleteMethodForm

/**
* @see \App\Http\Controllers\CardController::attachTask
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
export const attachTask = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attachTask.url(args, options),
    method: 'post',
})

attachTask.definition = {
    methods: ["post"],
    url: '/cards/{card}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CardController::attachTask
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
attachTask.url = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { card: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { card: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            card: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        card: typeof args.card === 'object'
        ? args.card.id
        : args.card,
    }

    return attachTask.definition.url
            .replace('{card}', parsedArgs.card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CardController::attachTask
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
attachTask.post = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attachTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::attachTask
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
const attachTaskForm = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attachTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::attachTask
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
attachTaskForm.post = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attachTask.url(args, options),
    method: 'post',
})

attachTask.form = attachTaskForm

/**
* @see \App\Http\Controllers\CardController::getTasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
export const getTasks = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTasks.url(args, options),
    method: 'get',
})

getTasks.definition = {
    methods: ["get","head"],
    url: '/cards/{card}/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CardController::getTasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
getTasks.url = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { card: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { card: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            card: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        card: typeof args.card === 'object'
        ? args.card.id
        : args.card,
    }

    return getTasks.definition.url
            .replace('{card}', parsedArgs.card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CardController::getTasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
getTasks.get = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTasks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CardController::getTasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
getTasks.head = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTasks.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CardController::getTasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
const getTasksForm = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTasks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CardController::getTasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
getTasksForm.get = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTasks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CardController::getTasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
getTasksForm.head = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTasks.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getTasks.form = getTasksForm

const CardController = { store, update, deleteMethod, attachTask, getTasks, delete: deleteMethod }

export default CardController
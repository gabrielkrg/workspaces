import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KanbanController::index
* @see app/Http/Controllers/KanbanController.php:18
* @route '/kanban'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kanban',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KanbanController::index
* @see app/Http/Controllers/KanbanController.php:18
* @route '/kanban'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::index
* @see app/Http/Controllers/KanbanController.php:18
* @route '/kanban'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KanbanController::index
* @see app/Http/Controllers/KanbanController.php:18
* @route '/kanban'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KanbanController::index
* @see app/Http/Controllers/KanbanController.php:18
* @route '/kanban'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KanbanController::index
* @see app/Http/Controllers/KanbanController.php:18
* @route '/kanban'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KanbanController::index
* @see app/Http/Controllers/KanbanController.php:18
* @route '/kanban'
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
* @see \App\Http\Controllers\KanbanController::show
* @see app/Http/Controllers/KanbanController.php:38
* @route '/kanban/{kanban}'
*/
export const show = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kanban/{kanban}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KanbanController::show
* @see app/Http/Controllers/KanbanController.php:38
* @route '/kanban/{kanban}'
*/
show.url = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{kanban}', parsedArgs.kanban.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::show
* @see app/Http/Controllers/KanbanController.php:38
* @route '/kanban/{kanban}'
*/
show.get = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KanbanController::show
* @see app/Http/Controllers/KanbanController.php:38
* @route '/kanban/{kanban}'
*/
show.head = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KanbanController::show
* @see app/Http/Controllers/KanbanController.php:38
* @route '/kanban/{kanban}'
*/
const showForm = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KanbanController::show
* @see app/Http/Controllers/KanbanController.php:38
* @route '/kanban/{kanban}'
*/
showForm.get = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KanbanController::show
* @see app/Http/Controllers/KanbanController.php:38
* @route '/kanban/{kanban}'
*/
showForm.head = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\KanbanController::store
* @see app/Http/Controllers/KanbanController.php:79
* @route '/kanban'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kanban',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KanbanController::store
* @see app/Http/Controllers/KanbanController.php:79
* @route '/kanban'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::store
* @see app/Http/Controllers/KanbanController.php:79
* @route '/kanban'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::store
* @see app/Http/Controllers/KanbanController.php:79
* @route '/kanban'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::store
* @see app/Http/Controllers/KanbanController.php:79
* @route '/kanban'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\KanbanController::update
* @see app/Http/Controllers/KanbanController.php:112
* @route '/kanban/{kanban}'
*/
export const update = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/kanban/{kanban}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\KanbanController::update
* @see app/Http/Controllers/KanbanController.php:112
* @route '/kanban/{kanban}'
*/
update.url = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{kanban}', parsedArgs.kanban.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::update
* @see app/Http/Controllers/KanbanController.php:112
* @route '/kanban/{kanban}'
*/
update.put = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\KanbanController::update
* @see app/Http/Controllers/KanbanController.php:112
* @route '/kanban/{kanban}'
*/
const updateForm = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::update
* @see app/Http/Controllers/KanbanController.php:112
* @route '/kanban/{kanban}'
*/
updateForm.put = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\KanbanController::deleteMethod
* @see app/Http/Controllers/KanbanController.php:161
* @route '/kanban/{kanban}'
*/
export const deleteMethod = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/kanban/{kanban}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KanbanController::deleteMethod
* @see app/Http/Controllers/KanbanController.php:161
* @route '/kanban/{kanban}'
*/
deleteMethod.url = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return deleteMethod.definition.url
            .replace('{kanban}', parsedArgs.kanban.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::deleteMethod
* @see app/Http/Controllers/KanbanController.php:161
* @route '/kanban/{kanban}'
*/
deleteMethod.delete = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\KanbanController::deleteMethod
* @see app/Http/Controllers/KanbanController.php:161
* @route '/kanban/{kanban}'
*/
const deleteMethodForm = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::deleteMethod
* @see app/Http/Controllers/KanbanController.php:161
* @route '/kanban/{kanban}'
*/
deleteMethodForm.delete = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\KanbanController::clone
* @see app/Http/Controllers/KanbanController.php:204
* @route '/kanban/{kanban}/clone'
*/
export const clone = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

clone.definition = {
    methods: ["post"],
    url: '/kanban/{kanban}/clone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KanbanController::clone
* @see app/Http/Controllers/KanbanController.php:204
* @route '/kanban/{kanban}/clone'
*/
clone.url = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return clone.definition.url
            .replace('{kanban}', parsedArgs.kanban.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::clone
* @see app/Http/Controllers/KanbanController.php:204
* @route '/kanban/{kanban}/clone'
*/
clone.post = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::clone
* @see app/Http/Controllers/KanbanController.php:204
* @route '/kanban/{kanban}/clone'
*/
const cloneForm = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::clone
* @see app/Http/Controllers/KanbanController.php:204
* @route '/kanban/{kanban}/clone'
*/
cloneForm.post = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clone.url(args, options),
    method: 'post',
})

clone.form = cloneForm

/**
* @see \App\Http\Controllers\KanbanController::bulkCards
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
export const bulkCards = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkCards.url(options),
    method: 'post',
})

bulkCards.definition = {
    methods: ["post"],
    url: '/bulk-cards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KanbanController::bulkCards
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
bulkCards.url = (options?: RouteQueryOptions) => {
    return bulkCards.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::bulkCards
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
bulkCards.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkCards.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::bulkCards
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
const bulkCardsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkCards.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::bulkCards
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
bulkCardsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkCards.url(options),
    method: 'post',
})

bulkCards.form = bulkCardsForm

const KanbanController = { index, show, store, update, deleteMethod, clone, bulkCards, delete: deleteMethod }

export default KanbanController
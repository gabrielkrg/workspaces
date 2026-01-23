import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ColumnController::store
* @see app/Http/Controllers/ColumnController.php:17
* @route '/columns/{kanban}'
*/
export const store = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/columns/{kanban}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ColumnController::store
* @see app/Http/Controllers/ColumnController.php:17
* @route '/columns/{kanban}'
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
* @see \App\Http\Controllers\ColumnController::store
* @see app/Http/Controllers/ColumnController.php:17
* @route '/columns/{kanban}'
*/
store.post = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ColumnController::store
* @see app/Http/Controllers/ColumnController.php:17
* @route '/columns/{kanban}'
*/
const storeForm = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ColumnController::store
* @see app/Http/Controllers/ColumnController.php:17
* @route '/columns/{kanban}'
*/
storeForm.post = (args: { kanban: string | number | { id: string | number } } | [kanban: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ColumnController::update
* @see app/Http/Controllers/ColumnController.php:38
* @route '/columns/{column}'
*/
export const update = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/columns/{column}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ColumnController::update
* @see app/Http/Controllers/ColumnController.php:38
* @route '/columns/{column}'
*/
update.url = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { column: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { column: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            column: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        column: typeof args.column === 'object'
        ? args.column.id
        : args.column,
    }

    return update.definition.url
            .replace('{column}', parsedArgs.column.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ColumnController::update
* @see app/Http/Controllers/ColumnController.php:38
* @route '/columns/{column}'
*/
update.put = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ColumnController::update
* @see app/Http/Controllers/ColumnController.php:38
* @route '/columns/{column}'
*/
const updateForm = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ColumnController::update
* @see app/Http/Controllers/ColumnController.php:38
* @route '/columns/{column}'
*/
updateForm.put = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ColumnController::deleteMethod
* @see app/Http/Controllers/ColumnController.php:56
* @route '/columns/{column}'
*/
export const deleteMethod = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/columns/{column}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ColumnController::deleteMethod
* @see app/Http/Controllers/ColumnController.php:56
* @route '/columns/{column}'
*/
deleteMethod.url = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { column: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { column: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            column: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        column: typeof args.column === 'object'
        ? args.column.id
        : args.column,
    }

    return deleteMethod.definition.url
            .replace('{column}', parsedArgs.column.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ColumnController::deleteMethod
* @see app/Http/Controllers/ColumnController.php:56
* @route '/columns/{column}'
*/
deleteMethod.delete = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ColumnController::deleteMethod
* @see app/Http/Controllers/ColumnController.php:56
* @route '/columns/{column}'
*/
const deleteMethodForm = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ColumnController::deleteMethod
* @see app/Http/Controllers/ColumnController.php:56
* @route '/columns/{column}'
*/
deleteMethodForm.delete = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ColumnController::getCards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
export const getCards = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCards.url(args, options),
    method: 'get',
})

getCards.definition = {
    methods: ["get","head"],
    url: '/columns/{column}/cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ColumnController::getCards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
getCards.url = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { column: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { column: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            column: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        column: typeof args.column === 'object'
        ? args.column.id
        : args.column,
    }

    return getCards.definition.url
            .replace('{column}', parsedArgs.column.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ColumnController::getCards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
getCards.get = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ColumnController::getCards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
getCards.head = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCards.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ColumnController::getCards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
const getCardsForm = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ColumnController::getCards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
getCardsForm.get = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ColumnController::getCards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
getCardsForm.head = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCards.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getCards.form = getCardsForm

const ColumnController = { store, update, deleteMethod, getCards, delete: deleteMethod }

export default ColumnController
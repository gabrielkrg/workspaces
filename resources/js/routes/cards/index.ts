import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import attach from './attach'
import get from './get'
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
* @see \App\Http\Controllers\KanbanController::bulk
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/bulk-cards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KanbanController::bulk
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KanbanController::bulk
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
bulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::bulk
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KanbanController::bulk
* @see app/Http/Controllers/KanbanController.php:172
* @route '/bulk-cards'
*/
bulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(options),
    method: 'post',
})

bulk.form = bulkForm

const cards = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    delete: Object.assign(deleteMethod, deleteMethod),
    attach: Object.assign(attach, attach),
    get: Object.assign(get, get),
    bulk: Object.assign(bulk, bulk),
}

export default cards
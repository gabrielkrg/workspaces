import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\NoteController::index
* @see app/Http/Controllers/NoteController.php:16
* @route '/notes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NoteController::index
* @see app/Http/Controllers/NoteController.php:16
* @route '/notes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NoteController::index
* @see app/Http/Controllers/NoteController.php:16
* @route '/notes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NoteController::index
* @see app/Http/Controllers/NoteController.php:16
* @route '/notes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\NoteController::index
* @see app/Http/Controllers/NoteController.php:16
* @route '/notes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NoteController::index
* @see app/Http/Controllers/NoteController.php:16
* @route '/notes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NoteController::index
* @see app/Http/Controllers/NoteController.php:16
* @route '/notes'
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
* @see \App\Http\Controllers\NoteController::show
* @see app/Http/Controllers/NoteController.php:37
* @route '/notes/{note}'
*/
export const show = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/notes/{note}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NoteController::show
* @see app/Http/Controllers/NoteController.php:37
* @route '/notes/{note}'
*/
show.url = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { note: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { note: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            note: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        note: typeof args.note === 'object'
        ? args.note.id
        : args.note,
    }

    return show.definition.url
            .replace('{note}', parsedArgs.note.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NoteController::show
* @see app/Http/Controllers/NoteController.php:37
* @route '/notes/{note}'
*/
show.get = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NoteController::show
* @see app/Http/Controllers/NoteController.php:37
* @route '/notes/{note}'
*/
show.head = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\NoteController::show
* @see app/Http/Controllers/NoteController.php:37
* @route '/notes/{note}'
*/
const showForm = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NoteController::show
* @see app/Http/Controllers/NoteController.php:37
* @route '/notes/{note}'
*/
showForm.get = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\NoteController::show
* @see app/Http/Controllers/NoteController.php:37
* @route '/notes/{note}'
*/
showForm.head = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\NoteController::store
* @see app/Http/Controllers/NoteController.php:50
* @route '/notes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/notes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NoteController::store
* @see app/Http/Controllers/NoteController.php:50
* @route '/notes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NoteController::store
* @see app/Http/Controllers/NoteController.php:50
* @route '/notes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NoteController::store
* @see app/Http/Controllers/NoteController.php:50
* @route '/notes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NoteController::store
* @see app/Http/Controllers/NoteController.php:50
* @route '/notes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\NoteController::update
* @see app/Http/Controllers/NoteController.php:72
* @route '/notes/{note}'
*/
export const update = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/notes/{note}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\NoteController::update
* @see app/Http/Controllers/NoteController.php:72
* @route '/notes/{note}'
*/
update.url = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { note: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { note: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            note: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        note: typeof args.note === 'object'
        ? args.note.id
        : args.note,
    }

    return update.definition.url
            .replace('{note}', parsedArgs.note.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NoteController::update
* @see app/Http/Controllers/NoteController.php:72
* @route '/notes/{note}'
*/
update.put = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\NoteController::update
* @see app/Http/Controllers/NoteController.php:72
* @route '/notes/{note}'
*/
const updateForm = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NoteController::update
* @see app/Http/Controllers/NoteController.php:72
* @route '/notes/{note}'
*/
updateForm.put = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\NoteController::deleteMethod
* @see app/Http/Controllers/NoteController.php:88
* @route '/notes/{note}'
*/
export const deleteMethod = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/notes/{note}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NoteController::deleteMethod
* @see app/Http/Controllers/NoteController.php:88
* @route '/notes/{note}'
*/
deleteMethod.url = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { note: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { note: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            note: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        note: typeof args.note === 'object'
        ? args.note.id
        : args.note,
    }

    return deleteMethod.definition.url
            .replace('{note}', parsedArgs.note.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NoteController::deleteMethod
* @see app/Http/Controllers/NoteController.php:88
* @route '/notes/{note}'
*/
deleteMethod.delete = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\NoteController::deleteMethod
* @see app/Http/Controllers/NoteController.php:88
* @route '/notes/{note}'
*/
const deleteMethodForm = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NoteController::deleteMethod
* @see app/Http/Controllers/NoteController.php:88
* @route '/notes/{note}'
*/
deleteMethodForm.delete = (args: { note: string | number | { id: string | number } } | [note: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteMethod.form = deleteMethodForm

const notes = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    delete: Object.assign(deleteMethod, deleteMethod),
}

export default notes
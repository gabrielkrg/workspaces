import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ColumnController::cards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
export const cards = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cards.url(args, options),
    method: 'get',
})

cards.definition = {
    methods: ["get","head"],
    url: '/columns/{column}/cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ColumnController::cards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
cards.url = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return cards.definition.url
            .replace('{column}', parsedArgs.column.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ColumnController::cards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
cards.get = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ColumnController::cards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
cards.head = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cards.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ColumnController::cards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
const cardsForm = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ColumnController::cards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
cardsForm.get = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ColumnController::cards
* @see app/Http/Controllers/ColumnController.php:68
* @route '/columns/{column}/cards'
*/
cardsForm.head = (args: { column: string | number | { id: string | number } } | [column: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cards.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

cards.form = cardsForm

const get = {
    cards: Object.assign(cards, cards),
}

export default get
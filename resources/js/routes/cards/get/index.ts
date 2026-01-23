import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CardController::tasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
export const tasks = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tasks.url(args, options),
    method: 'get',
})

tasks.definition = {
    methods: ["get","head"],
    url: '/cards/{card}/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CardController::tasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
tasks.url = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return tasks.definition.url
            .replace('{card}', parsedArgs.card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CardController::tasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
tasks.get = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tasks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CardController::tasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
tasks.head = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tasks.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CardController::tasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
const tasksForm = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CardController::tasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
tasksForm.get = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CardController::tasks
* @see app/Http/Controllers/CardController.php:176
* @route '/cards/{card}/tasks'
*/
tasksForm.head = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasks.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tasks.form = tasksForm

const get = {
    tasks: Object.assign(tasks, tasks),
}

export default get
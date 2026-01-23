import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CardController::task
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
export const task = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: task.url(args, options),
    method: 'post',
})

task.definition = {
    methods: ["post"],
    url: '/cards/{card}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CardController::task
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
task.url = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return task.definition.url
            .replace('{card}', parsedArgs.card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CardController::task
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
task.post = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: task.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::task
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
const taskForm = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: task.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CardController::task
* @see app/Http/Controllers/CardController.php:141
* @route '/cards/{card}/tasks'
*/
taskForm.post = (args: { card: string | number | { id: string | number } } | [card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: task.url(args, options),
    method: 'post',
})

task.form = taskForm

const attach = {
    task: Object.assign(task, task),
}

export default attach
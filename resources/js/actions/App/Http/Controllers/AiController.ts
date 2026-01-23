import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
export const generateWithAi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateWithAi.url(options),
    method: 'post',
})

generateWithAi.definition = {
    methods: ["post"],
    url: '/api/generate-with-ai',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
generateWithAi.url = (options?: RouteQueryOptions) => {
    return generateWithAi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
generateWithAi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateWithAi.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
const generateWithAiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateWithAi.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiController::generateWithAi
* @see app/Http/Controllers/AiController.php:11
* @route '/api/generate-with-ai'
*/
generateWithAiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateWithAi.url(options),
    method: 'post',
})

generateWithAi.form = generateWithAiForm

const AiController = { generateWithAi }

export default AiController
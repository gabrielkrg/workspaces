import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  repeat: z.string(),
  highlight: z.boolean(),
  done: z.boolean(),
  delete_after: z.boolean(),
  client_id: z.string(),
  tags: z.array(z.string()),
})

export type Task = z.infer<typeof taskSchema>

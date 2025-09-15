import { h } from 'vue'
import {
  CheckCircle2, Circle, CircleOff, Repeat
} from 'lucide-vue-next'

export const statuses = [
  {
    value: false,
    label: 'Todo',
    icon: h(Circle),
  },

  {
    value: true,
    label: 'Done',
    icon: h(CheckCircle2),
  },
]

export const repeats = [
  {
    value: 'none',
    label: 'Never',
    icon: h(CircleOff),
  },
  {
    value: 'daily',
    label: 'Daily',
    icon: h(Repeat),
  },
  {
    value: 'weekly',
    label: 'Weekly',
    icon: h(Repeat),
  },
  {
    value: 'monthly',
    label: 'Monthly',
    icon: h(Repeat),
  },
]

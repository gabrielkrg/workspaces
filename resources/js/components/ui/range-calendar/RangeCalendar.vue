<script lang="ts" setup>
import type { RangeCalendarRootEmits, RangeCalendarRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { RangeCalendarRoot, useForwardPropsEmits } from "reka-ui"
import { cn } from "@/lib/utils"
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNextButton,
  CalendarPrevButton,
} from "@/components/ui/calendar"
import RangeCalendarCellTrigger from "./RangeCalendarCellTrigger.vue"

const props = defineProps<RangeCalendarRootProps & { class?: HTMLAttributes["class"] }>()

const emits = defineEmits<RangeCalendarRootEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ grid, weekDays }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
  >
    <CalendarHeader>
      <CalendarPrevButton />
      <CalendarHeading />
      <CalendarNextButton />
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <RangeCalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>

import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

declare module 'vue3-apexcharts' {
    import { DefineComponent } from 'vue';
    const VueApexCharts: DefineComponent<{
        type?: string;
        options?: Record<string, any>;
        series?: any[];
        width?: string | number;
        height?: string | number;
    }>;
    export default VueApexCharts;
}

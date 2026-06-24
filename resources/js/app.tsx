import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pages = import.meta.glob<{ default: ComponentType }>('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return (await page()).default;
    },

    setup({ el, App, props }) {
        // Make route() available globally so every component can use it
        // without importing it every time
        // @ts-expect-error — ziggy attaches to window
        window.route = route;
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#9a4601',
    },
});
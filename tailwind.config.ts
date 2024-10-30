import type { Config } from "tailwindcss";

const config: Config = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ["Playfair Display", "sans-serif"],
			serif: ["Playfair Display", "serif"],
			system: ["system-ui", "sans-serif"],
		},
		extend: {
			transitionTimingFunction: {
				"ease-in-out": "ease-in-out",
				"snap": "cubic-bezier(1,.37,.3,.88)",
			},
			colors: {
				"background": "var(--background)",
				"color": "var(--color)",
				"border": "var(--border)",
			}
		},
	},
	plugins: [],
}


export default config;
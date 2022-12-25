/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			sm: '320px',
			md: '425px',
			lg: '768px',
			xl: '1024px'
		},
		extend: {}
	},
	plugins: []
};

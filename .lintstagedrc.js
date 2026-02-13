/** @type {import('lint-staged').Config} */
export default {
	// TypeScript and JavaScript files - run Biome check
	"*.{ts,tsx,js,jsx}": ["biome check --write --no-errors-on-unmatched"],

	// JSON and Markdown files - run Biome format only
	"*.{json,jsonc}": ["biome format --write --no-errors-on-unmatched"],

	// CSS and SCSS files - just check formatting
	"*.{css,scss}": ["biome format --write --no-errors-on-unmatched"],
};

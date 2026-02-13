/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		// Type must be one of the following
		"type-enum": [
			2,
			"always",
			[
				"feat", // New feature
				"fix", // Bug fix
				"docs", // Documentation changes
				"style", // Code style changes (formatting, etc)
				"refactor", // Code refactoring
				"perf", // Performance improvements
				"test", // Adding or updating tests
				"build", // Build system or dependencies
				"ci", // CI configuration
				"chore", // Other changes (maintenance)
				"revert", // Revert a previous commit
			],
		],
		// Subject should not be empty
		"subject-empty": [2, "never"],
		// Subject should not end with a period
		"subject-full-stop": [2, "never", "."],
		// Subject should be in sentence case or lower case
		"subject-case": [
			2,
			"always",
			["sentence-case", "lower-case", "start-case"],
		],
		// Type should not be empty
		"type-empty": [2, "never"],
		// Type should be lowercase
		"type-case": [2, "always", "lower-case"],
		// Max header length
		"header-max-length": [2, "always", 100],
		// Body should start with a blank line
		"body-leading-blank": [1, "always"],
		// Footer should start with a blank line
		"footer-leading-blank": [1, "always"],
	},
	helpUrl:
		"https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
};

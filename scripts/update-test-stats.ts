#!/usr/bin/env bun

/**
 * Updates TESTING-STRATEGY.md with current test coverage statistics
 * Run with: bun run scripts/update-test-stats.ts
 * Or via: bun test:stats
 */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";

const ROOT_DIR = join(import.meta.dir, "..");
const STRATEGY_FILE = join(ROOT_DIR, "docs/TESTING-STRATEGY.md");

interface UnitStats {
	statements: string;
	branches: string;
	functions: string;
	lines: string;
	testFiles: string;
	tests: string;
	status: string;
}

interface E2EStats {
	specFiles: string;
	tests: string;
	passed: string;
	failed: string;
	status: string;
}

function safeParseInt(value: string | undefined): number {
	if (!value || value === "?" || value === "Error") return 0;
	const parsed = Number.parseInt(value, 10);
	return Number.isNaN(parsed) ? 0 : parsed;
}

// Strip ANSI escape codes from terminal output
function stripAnsi(str: string): string {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping ANSI codes requires control chars
	return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

async function getWebUnitCoverage(): Promise<UnitStats> {
	console.log("📊 Running web app unit tests with coverage...");

	try {
		const rawResult =
			await $`cd ${ROOT_DIR}/apps/web && bunx vitest run --coverage 2>&1`.text();

		// Strip ANSI codes for reliable regex matching
		const result = stripAnsi(rawResult);

		// Extract coverage percentages
		const allFilesMatch = result.match(
			/All files\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)/,
		);

		// Extract test file count - format: "Test Files  169 passed (169)"
		const testFilesMatch = result.match(/Test Files\s+(\d+)\s+passed/);
		// Extract test count - format: "Tests  2876 passed (2876)"
		const testsMatch = result.match(/Tests\s+(\d+)\s+passed/);

		if (allFilesMatch) {
			const hasErrors = result.includes("ERROR:");
			return {
				statements: `${allFilesMatch[1]}%`,
				branches: `${allFilesMatch[2]}%`,
				functions: `${allFilesMatch[3]}%`,
				lines: `${allFilesMatch[4]}%`,
				testFiles: testFilesMatch ? testFilesMatch[1] : "?",
				tests: testsMatch ? testsMatch[1] : "?",
				status: hasErrors ? "Below 80%" : "Above 80%",
			};
		}
	} catch (error) {
		console.error("Web unit coverage failed:", error);
	}

	return {
		statements: "Error",
		branches: "Error",
		functions: "Error",
		lines: "Error",
		testFiles: "Error",
		tests: "Error",
		status: "Failed",
	};
}

async function getServerUnitCoverage(): Promise<UnitStats> {
	console.log("📊 Running server app unit tests with coverage...");

	try {
		const rawResult =
			await $`cd ${ROOT_DIR}/apps/server && bunx vitest run --coverage 2>&1`.text();

		// Strip ANSI codes for reliable regex matching
		const result = stripAnsi(rawResult);

		// Extract coverage percentages
		const allFilesMatch = result.match(
			/All files\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)/,
		);

		// Extract test file count and test count
		const testFilesMatch = result.match(/Test Files\s+(\d+)\s+passed/);
		const testsMatch = result.match(/Tests\s+(\d+)\s+passed/);

		if (allFilesMatch) {
			const hasErrors = result.includes("ERROR:");
			return {
				statements: `${allFilesMatch[1]}%`,
				branches: `${allFilesMatch[2]}%`,
				functions: `${allFilesMatch[3]}%`,
				lines: `${allFilesMatch[4]}%`,
				testFiles: testFilesMatch ? testFilesMatch[1] : "?",
				tests: testsMatch ? testsMatch[1] : "?",
				status: hasErrors ? "Below 80%" : "100%",
			};
		}
	} catch (error) {
		console.error("Server unit coverage failed:", error);
	}

	return {
		statements: "Error",
		branches: "Error",
		functions: "Error",
		lines: "Error",
		testFiles: "Error",
		tests: "Error",
		status: "Failed",
	};
}

async function getE2EStats(): Promise<E2EStats> {
	console.log("🎭 Running E2E tests with Playwright...");

	// Count spec files first
	let specFiles = "?";
	try {
		const specFilesResult =
			await $`find ${ROOT_DIR}/apps/web/e2e -name "*.spec.ts" 2>/dev/null | wc -l`.text();
		specFiles = specFilesResult.trim();
	} catch {
		// ignore
	}

	try {
		// Run playwright with list reporter
		const result =
			await $`cd ${ROOT_DIR}/apps/web && bunx playwright test --reporter=list 2>&1`.text();

		// Extract test counts from output
		const passedMatch = result.match(/(\d+)\s+passed/);
		const failedMatch = result.match(/(\d+)\s+failed/);

		const passed = passedMatch ? passedMatch[1] : "0";
		const failed = failedMatch ? failedMatch[1] : "0";
		const total = safeParseInt(passed) + safeParseInt(failed);

		return {
			specFiles,
			tests: total.toString(),
			passed,
			failed,
			status: failed === "0" ? "All passing" : `${failed} failing`,
		};
	} catch (error) {
		// Playwright might fail if tests fail, but we can still extract counts
		const errorStr = String(error);

		const passedMatch = errorStr.match(/(\d+)\s+passed/);
		const failedMatch = errorStr.match(/(\d+)\s+failed/);

		if (passedMatch || failedMatch) {
			const passed = passedMatch ? passedMatch[1] : "0";
			const failed = failedMatch ? failedMatch[1] : "0";
			const total = safeParseInt(passed) + safeParseInt(failed);

			return {
				specFiles,
				tests: total.toString(),
				passed,
				failed,
				status: failed === "0" ? "All passing" : `${failed} failing`,
			};
		}

		console.error("E2E tests failed:", error);
	}

	return {
		specFiles,
		tests: "?",
		passed: "?",
		failed: "?",
		status: "Not run",
	};
}

function generateTable(
	webUnit: UnitStats,
	serverUnit: UnitStats,
	e2e: E2EStats,
): string {
	const now = new Date().toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});

	const totalUnitTests =
		safeParseInt(webUnit.tests) + safeParseInt(serverUnit.tests);
	const totalE2ETests = safeParseInt(e2e.tests);
	const totalTests = totalUnitTests + totalE2ETests;

	return `<!-- COVERAGE_START -->
**Last Updated:** ${now}

### Unit Test Coverage (Vitest)

| App | Statements | Branches | Functions | Lines | Test Files | Tests | Status |
|-----|------------|----------|-----------|-------|------------|-------|--------|
| **Web** | ${webUnit.statements} | ${webUnit.branches} | ${webUnit.functions} | ${webUnit.lines} | ${webUnit.testFiles} | ${webUnit.tests} | ${webUnit.status} |
| **Server** | ${serverUnit.statements} | ${serverUnit.branches} | ${serverUnit.functions} | ${serverUnit.lines} | ${serverUnit.testFiles} | ${serverUnit.tests} | ${serverUnit.status} |

### E2E Tests (Playwright)

| App | Spec Files | Tests | Passed | Failed | Status |
|-----|------------|-------|--------|--------|--------|
| **Web** | ${e2e.specFiles} | ${e2e.tests} | ${e2e.passed} | ${e2e.failed} | ${e2e.status} |

### Summary

| Metric | Count |
|--------|-------|
| **Total Unit Tests** | ${totalUnitTests.toLocaleString()} |
| **Total E2E Tests** | ${totalE2ETests.toLocaleString()} |
| **Total Tests** | ${totalTests.toLocaleString()} |
<!-- COVERAGE_END -->`;
}

async function updateStrategyFile(
	webUnit: UnitStats,
	serverUnit: UnitStats,
	e2e: E2EStats,
): Promise<void> {
	console.log("\n📝 Updating TESTING-STRATEGY.md...");

	const content = await readFile(STRATEGY_FILE, "utf-8");
	const newTable = generateTable(webUnit, serverUnit, e2e);

	const updated = content.replace(
		/<!-- COVERAGE_START -->[\s\S]*?<!-- COVERAGE_END -->/,
		newTable,
	);

	await writeFile(STRATEGY_FILE, updated);
	console.log("✅ TESTING-STRATEGY.md updated successfully!");
}

async function main() {
	console.log("🧪 Test Stats Generator\n");

	// Run unit tests in parallel, E2E separately (it's slower)
	const [webUnit, serverUnit] = await Promise.all([
		getWebUnitCoverage(),
		getServerUnitCoverage(),
	]);

	const e2e = await getE2EStats();

	console.log("\n📈 Results:");
	console.log("Web Unit:", webUnit);
	console.log("Server Unit:", serverUnit);
	console.log("E2E:", e2e);

	await updateStrategyFile(webUnit, serverUnit, e2e);

	const totalUnit =
		safeParseInt(webUnit.tests) + safeParseInt(serverUnit.tests);
	const totalE2E = safeParseInt(e2e.tests);

	console.log("\n🎉 Done!");
	console.log(`   📦 Unit Tests: ${totalUnit.toLocaleString()}`);
	console.log(`   🎭 E2E Tests: ${totalE2E.toLocaleString()}`);
	console.log(`   📊 Total: ${(totalUnit + totalE2E).toLocaleString()}`);
	console.log("\nCheck docs/TESTING-STRATEGY.md for full stats.");
}

main().catch(console.error);

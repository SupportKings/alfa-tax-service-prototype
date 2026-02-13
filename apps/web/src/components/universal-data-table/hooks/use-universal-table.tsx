"use client";

import { useState } from "react";

import { useDataTableFilters } from "@/components/data-table-filter";
import type {
	ColumnConfig,
	FiltersState,
} from "@/components/data-table-filter/core/types";

import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	type Updater,
	useReactTable,
} from "@tanstack/react-table";
import type { FacetedData, RowAction, UniversalTableRow } from "../types";

interface UseUniversalTableProps<T extends UniversalTableRow> {
	// Data passed from feature
	data: T[];
	totalCount?: number;

	// Table configuration
	columns: ColumnDef<T>[];
	columnsConfig: ColumnConfig<T>[];

	// Filter system
	filters: FiltersState;
	onFiltersChange: React.Dispatch<React.SetStateAction<FiltersState>>;
	faceted?: FacetedData;

	// UI configuration
	enableSelection?: boolean;
	pageSize?: number;
	serverSide?: boolean;
	rowActions?: RowAction<T>[];

	// Loading state (passed from feature)
	isLoading?: boolean;
	isError?: boolean;
	error?: Error | null;

	// Server-side callbacks
	onPaginationChange?: (pageIndex: number, pageSize: number) => void;
	onSortingChange?: (sorting: SortingState) => void;
}

export function useUniversalTable<T extends UniversalTableRow>({
	data,
	totalCount = 0,
	columns,
	columnsConfig,
	filters,
	onFiltersChange,
	faceted = {},
	enableSelection = false,
	pageSize = 25,
	serverSide = true,
	rowActions,
	isLoading = false,
	isError = false,
	error = null,
	onPaginationChange,
	onSortingChange,
}: UseUniversalTableProps<T>) {
	const [rowSelection, setRowSelection] = useState({});
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
	const [sorting, setSorting] = useState<SortingState>([]);

	// Handle pagination changes
	const handlePaginationChange = (updater: Updater<PaginationState>) => {
		const newPagination =
			typeof updater === "function" ? updater(pagination) : updater;
		setPagination(newPagination);

		// Notify parent component if callback provided
		if (onPaginationChange && serverSide) {
			onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
		}
	};

	// Handle sorting changes
	const handleSortingChange = (updater: Updater<SortingState>) => {
		const newSorting =
			typeof updater === "function" ? updater(sorting) : updater;
		setSorting(newSorting);

		// Notify parent component if callback provided
		if (onSortingChange && serverSide) {
			onSortingChange(newSorting);
		}
	};

	// Use the existing data table filters hook
	const {
		columns: filterColumns,
		filters: filterState,
		actions,
		strategy,
	} = useDataTableFilters({
		strategy: serverSide ? "server" : "client",
		data: data || [],
		columnsConfig,
		filters,
		onFiltersChange,
		faceted,
	});

	// Reset pagination when filters change
	const [previousFilters, setPreviousFilters] = useState(filters);
	if (JSON.stringify(previousFilters) !== JSON.stringify(filters)) {
		setPreviousFilters(filters);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}

	// Create TanStack table instance
	const tableInstance = useReactTable({
		data: data || [],
		columns,
		getRowId: (row: T) =>
			String((row as Record<string, unknown>).id ?? Math.random()),
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onRowSelectionChange: enableSelection ? setRowSelection : undefined,
		onPaginationChange: handlePaginationChange,
		onSortingChange: handleSortingChange,
		manualPagination: serverSide,
		manualSorting: serverSide,
		pageCount: serverSide ? Math.ceil(totalCount / pagination.pageSize) : -1,
		state: {
			pagination,
			rowSelection: enableSelection ? rowSelection : {},
			sorting,
		},
	});

	return {
		// Table instance for rendering
		table: tableInstance,

		// Filter components
		filterColumns,
		filterState,
		actions,
		strategy,

		// Loading states
		isLoading,
		isError,
		error,

		// Data
		data: data || [],

		// Row actions
		rowActions,

		// Pagination (server-side)
		totalCount,
		pageCount: Math.ceil(totalCount / pageSize),
	};
}

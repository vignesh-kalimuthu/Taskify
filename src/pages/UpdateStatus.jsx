import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { CiViewList } from "react-icons/ci";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FiEdit, FiTrash2 } from "react-icons/fi";
const UpdateStatus = () => {
  const data = useMemo(
    () => [
      { id: 1, title: "Learn React", priority: "High", status: "Pending" },
      {
        id: 2,
        title: "Study TanStack Table",
        priority: "Medium",
        status: "In Progress",
      },
      { id: 3, title: "Build Todo App", priority: "Low", status: "Completed" },
      { id: 4, title: "Fix Bugs", priority: "High", status: "Pending" },
      { id: 5, title: "Deploy App", priority: "Medium", status: "Completed" },
      { id: 6, title: "Write Docs", priority: "Low", status: "Pending" },
      { id: 7, title: "Review Code", priority: "High", status: "In Progress" },
      {
        id: 8,
        title: "Plan Features",
        priority: "Medium",
        status: "Completed",
      },
      { id: 9, title: "Refactor Code", priority: "High", status: "Pending" },
      { id: 10, title: "Add Analytics", priority: "Low", status: "Completed" },
    ],
    []
  );

  // --- Column Setup ---
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),
    columnHelper.accessor("title", {
      header: "Task Title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue() === "High"
              ? "bg-red-100 text-red-700"
              : info.getValue() === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            info.getValue() === "Pending"
              ? "bg-red-100 text-red-700"
              : info.getValue() === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),

    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          {/* Edit Button */}
          <button
            className="text-blue-500/50 hover:text-blue-700"
            onClick={() => alert(`Edit: ${row.original.id}`)}
          >
            <FiEdit size={18} />
          </button>

          {/* Delete Button */}
          <button
            className="text-red-500/40 hover:text-red-700/40"
            onClick={() => alert(`Delete: ${row.original.id}`)}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // --- States ---
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  // --- Filtered Data ---
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [data, globalFilter]);

  // --- Table Instance ---
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // --- Pagination Rendering ---
  const renderPageNumbers = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pages = [];

    const addPage = (page) => {
      pages.push(
        <button
          key={page}
          onClick={() => table.setPageIndex(page - 1)}
          className={`  rounded-full text-sm ${
            currentPage === page
              ? "bg-cyan-500 text-white  rounded-full px-2 py-0.5 m-1 hover:border-cyan-500 hover:border hover:bg-white hover:text-cyan-600"
              : "hover:border-cyan-500  rounded-full px-2 py-0.5 m-1 hover:border hover:bg-white hover:text-cyan-600"
          }`}
        >
          {page}
        </button>
      );
    };

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 3) pages.push(<span key="dots1">...</span>);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) addPage(i);
      if (currentPage < totalPages - 2)
        pages.push(<span key="dots2">...</span>);
      addPage(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className=" border-cyan-400 border bg-white rounded-md p-3 mb-3">
        <h2 className="flex items-center text-cyan-500 gap-2 text-xl font-semibold mb-4">
          <CiViewList className="text-3xl text-cyan-500" /> Status List
        </h2>

        {/* --- Search and Page Size --- */}
        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            placeholder={`🔍 Search...`}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1  text-sm w-1/3 focus:ring-1 focus:ring-cyan-500 outline-none"
          />

          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-400">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              className="border border-gray-200 rounded-sm text-gray-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              value={pageSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                setPageSize(size);
                table.setPageSize(size);
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto border border-cyan-400 rounded-md">
        <table className="min-w-full text-sm border-collapse rounded  border-none ">
          <thead className="bg-cyan-400 text-white rounded ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort(); // ✅ check if sorting enabled
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={`border-b-cyan-400  border-black p-2 text-left ${
                        canSort ? "cursor-pointer select-none" : ""
                      }`}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {/* 👇 Show arrow only if sorting is enabled */}
                        {canSort && (
                          <span className="ml-1 relative group">
                            {isSorted === "asc"
                              ? "▲"
                              : isSorted === "desc"
                              ? "▼"
                              : "⇅"}

                            {/* Tooltip below */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-white border-cyan-400 text-cyan-400 text-xs rounded py-1 px-2 whitespace-nowrap shadow-md z-50">
                              Sort
                            </span>
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b-cyan-400 border-b p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          className="bg-cyan-500 text-sm text-white p-2 rounded-full   border border-transparent hover:bg-white hover:text-cyan-500 hover:border hover:border-cyan-500 disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <GrPrevious />
        </button>

        <div className="flex items-center space-x-1 rounded-full">
          {renderPageNumbers()}
        </div>

        <button
          className="bg-cyan-500 text-sm text-white p-2 rounded-full   border border-transparent hover:bg-white hover:text-cyan-500 hover:border hover:border-cyan-500 disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default UpdateStatus;

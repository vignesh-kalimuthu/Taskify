import React, { useMemo, useState, useEffect } from "react";
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

import API from "../utils/axios";

const UpdateStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await API.get("/todos");
        setData(res.data);
        console.log("Fetched Todos:", res.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching todos...");

    fetchTodos();

    const handler = () => fetchTodos();
    window.addEventListener("refreshTodos", handler);

    return () => window.removeEventListener("refreshTodos", handler);
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    {
      header: "S.No",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },

    columnHelper.accessor("title", {
      header: "Task Title",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("priority", {
      header: "Priority",
      cell: ({ row }) => {
        const priorities = ["Low", "Medium", "High"];

        const updatePriority = async (value) => {
          try {
            await API.patch(`/todos/${row.original.id}`, { priority: value });
            window.dispatchEvent(new Event("refreshTodos"));
          } catch (error) {
            console.error("Priority update failed:", error);
          }
        };

        return (
          <div className="flex gap-1">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => updatePriority(p)}
                className={`px-2 py-1 text-xs rounded-full border transition
              ${
                p === row.original.priority
                  ? p === "High"
                    ? "bg-red-500 text-white border-red-500"
                    : p === "Medium"
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-green-500 text-white border-green-500"
                  : "bg-white hover:bg-gray-200"
              }`}
              >
                {p}
              </button>
            ))}
          </div>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const statusOptions = ["Pending", "In Progress", "Completed"];

        const updateStatus = async (value) => {
          try {
            await API.patch(`/todos/${row.original.id}`, { status: value });
            window.dispatchEvent(new Event("refreshTodos"));
          } catch (error) {
            console.error("Status update failed:", error);
          }
        };

        const getStatusStyle = (status) => {
          if (status === row.original.status) {
            return {
              Pending: "bg-gray-500 text-white border-gray-500",
              "In Progress": "bg-blue-500 text-white border-blue-500",
              Completed: "bg-green-500 text-white border-green-500",
            }[status];
          }

          return "bg-white hover:bg-gray-200";
        };

        return (
          <div className="flex gap-1">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                className={`px-2 py-1 text-xs rounded-full border transition ${getStatusStyle(
                  status
                )}`}
              >
                {status}
              </button>
            ))}
          </div>
        );
      },
    }),
  ];

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [data, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
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

  if (loading)
    return (
      <div className="p-4 text-center font-medium text-gray-500">
        Loading tasks...
      </div>
    );

  const renderPageNumbers = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pages = [];

    const addPage = (page) => {
      pages.push(
        <button
          key={page}
          onClick={() => table.setPageIndex(page - 1)}
          className={`rounded-full text-sm ${
            currentPage === page
              ? "bg-cyan-500 text-white rounded-full px-2 py-0.5 m-1"
              : "rounded-full px-2 py-0.5 m-1 hover:border hover:border-cyan-500 hover:text-cyan-600"
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
      <div className="border-cyan-400 border bg-white rounded-md p-3 mb-3">
        <h2 className="flex items-center text-cyan-500 gap-2 text-xl font-semibold mb-4">
          <CiViewList className="text-3xl text-cyan-500" /> Task Status
        </h2>

        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-1/3 focus:ring-1 focus:ring-cyan-500 outline-none"
          />

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                setPageSize(size);
                table.setPageSize(size);
              }}
              className="border border-gray-200 rounded-sm text-gray-500 focus:ring-1 focus:ring-cyan-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-cyan-400 rounded-md">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-cyan-400 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={`p-2 text-left ${
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

                        {canSort && (
                          <span className="ml-1">
                            {isSorted === "asc"
                              ? "▲"
                              : isSorted === "desc"
                              ? "▼"
                              : "⇅"}
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
                  <td key={cell.id} className="border-b p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          className="bg-cyan-500 text-white p-2 rounded-full disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <GrPrevious />
        </button>

        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        <button
          className="bg-cyan-500 text-white p-2 rounded-full disabled:opacity-50"
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

import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { CiViewList, CiViewTimeline } from "react-icons/ci";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FiTrash2 } from "react-icons/fi";
import API from "../utils/axios";
import ViewTask from "../components/ViewTask";

const TodoList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);

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

  const handleViewTodo = (id) => {
    console.log("View Todo ID:", id);
    setSelectedTodoId(id);
    setIsModalOpen(true);
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

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
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleViewTodo(row.original.id)}
          >
            <CiViewTimeline size={18} />
          </button>

          <button
            className="text-red-500/40 hover:text-red-700/40"
            onClick={() => deleteTodo(row.original.id)}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
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
          <CiViewList className="text-3xl text-cyan-500" /> Task List
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
      <ViewTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        todoId={selectedTodoId}
      />
    </div>
  );
};

export default TodoList;

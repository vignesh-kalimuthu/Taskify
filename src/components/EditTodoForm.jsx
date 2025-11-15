import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

const EditTodoForm = ({ isOpen, onClose }) => {
  const schema = yup.object({
    title: yup
      .string()
      .trim()
      .required("Title is required")
      .min(5, "Title must be at least 5 characters")
      .max(50, "Title cannot exceed 50 characters"),
    description: yup
      .string()
      .trim()
      .required("Description is required")
      .min(5, "Description must be at least 5 characters")
      .max(150, "Description cannot exceed 150 characters"),
    category: yup
      .string()
      .required("Please select a category")
      .notOneOf([""], "Category is required"),
    priority: yup
      .string()
      .required("Please select a priority")
      .notOneOf([""], "Priority is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    console.log("formData", data);
    toast.success("Task added successfully!");
    // reset();
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="flex-1 overflow-y-auto px-1 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-1   text-sm sm:text-sm"
      >
        {/* Title */}
        <div className="flex flex-col">
          <label className="block text-gray-700 dark:text-white text-sm sm:text-base font-medium">
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            className={`mt-1 w-full rounded-md border bg-white p-1 sm:p-1.5 text-gray-800 placeholder:text-gray-400/70 
      focus:outline-none focus:ring-2 
      ${
        errors.title
          ? "border-red-500 focus:ring-[1px]  focus:ring-red-500"
          : "border-gray-300 focus:ring-[1px] focus:ring-cyan-500"
      }`}
            placeholder="Enter title"
            onKeyDown={(e) => {
              if (e.key === " " && e.target.selectionStart === 0)
                e.preventDefault();
            }}
          />
          {errors.title && (
            <p className="text-red-500 text-xs sm:text-xs ">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="block text-gray-700 dark:text-white text-sm sm:text-base font-medium">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className={`mt-1 w-full rounded-md resize-none border bg-white p-1 sm:p-1.5 text-gray-800 placeholder:text-gray-400/70 
      focus:outline-none focus:ring-2 
      ${
        errors.description
          ? "border-red-500 focus:ring-[1px]  focus:ring-red-500"
          : "border-gray-300 focus:ring-[1px] focus:ring-cyan-500"
      }`}
            placeholder="Enter description"
            onKeyDown={(e) => {
              if (e.key === " " && e.target.selectionStart === 0)
                e.preventDefault();
            }}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs sm:text-xs ">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="block text-gray-700 dark:text-white text-sm sm:text-base font-medium"
          >
            Select a Category
          </label>
          <select
            id="category"
            {...register("category")}
            className={`mt-1 w-full rounded-md border border-gray-300 bg-white p-1 sm:p-1.5 text-gray-700 focus:outline-none focus:ring-2  ${
              errors.description
                ? "border-red-500 focus:ring-[1px]  focus:ring-red-500"
                : "border-gray-300 focus:ring-[1px] focus:ring-cyan-500"
            }`}
          >
            <option value="">Choose a category</option>
            <option value="work">Work</option>
            <option value="home">Home</option>
            <option value="shopping">Shopping</option>
            <option value="travel">Travel</option>
            <option value="others">Others</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs sm:text-xs ">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Priority */}
        <div className="flex flex-col">
          <label
            htmlFor="priority"
            className="block text-gray-700 dark:text-white text-sm sm:text-base font-medium"
          >
            Select a Priority
          </label>
          <select
            id="priority"
            {...register("priority")}
            className={`mt-1 w-full rounded-md border border-gray-300 bg-white p-1 sm:p-1.5 text-gray-700 focus:outline-none focus:ring-2  ${
              errors.description
                ? "border-red-500 focus:ring-[1px]  focus:ring-red-500"
                : "border-gray-300 focus:ring-[1px] focus:ring-cyan-500"
            }`}
          >
            <option value="">Choose a priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.priority && (
            <p className="text-red-500 text-xs sm:text-xs ">
              {errors.priority.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-3">
          <button
            className="bg-red-500 text-sm text-white px-3 py-1 rounded-sm hover:bg-white hover:text-red-500 hover:border hover:border-red-500  transition-all duration-300 border border-transparent"
            type="button"
            onClick={onClose}
          >
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            className="bg-cyan-500 text-sm text-white px-3 py-1 rounded-sm  transition-all duration-300 border border-transparent hover:bg-white hover:text-cyan-500 hover:border hover:border-cyan-500"
            type="submit"
          >
            {" "}
            Submit{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTodoForm;

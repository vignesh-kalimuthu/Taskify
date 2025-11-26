import { useForm } from "react-hook-form";
import API from "../utils/axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const updatePassword = async (data) => {
    setLoading(true);
    try {
      if (data.oldPassword === data.newPassword) {
        toast.error("New password is same as old");
        setLoading(false);
        return;
      } else {
        await API.patch("/auth/change-password", {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        });

        toast.success("Password successfully updated!");
        reset();
        onClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-xl animate-scale">
        <h2 className="text-xl font-bold text-center">Change Password</h2>

        <form className="space-y-4" onSubmit={handleSubmit(updatePassword)}>
          {/* Old Password */}
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <div className="relative mt-1">
              <input
                {...register("oldPassword", { required: "Required" })}
                type={showOld ? "text" : "password"}
                className="border p-2 w-full rounded"
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? (
                  <FiEyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiEye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            {errors.oldPassword && (
              <p className="text-red-600 text-xs">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium">New Password</label>
            <div className="relative mt-1">
              <input
                {...register("newPassword", {
                  required: "Required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                type={showNew ? "text" : "password"}
                className="border p-2 w-full rounded"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? (
                  <FiEyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiEye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-red-600 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative mt-1">
              <input
                {...register("confirmPassword", {
                  required: "Required",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                type={showConfirm ? "text" : "password"}
                className="border p-2 w-full rounded"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <FiEyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiEye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-600 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-gray-600 hover:text-black"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

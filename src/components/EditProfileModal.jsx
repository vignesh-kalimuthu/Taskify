import { useForm } from "react-hook-form";
import API from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useContext } from "react";

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, setUser } = useContext(AuthContext);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, email: user?.email },
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.patch("/auth/update", data);
      toast.success("Profile updated!");
      setUser(res.data.user);
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-xs z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-3 sm:p-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl transition-all duration-300
               max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-bold text-md">Edit Profile</h1>
          <button
            onClick={onClose}
            className="text-md text-gray-500 hover:text-gray-900"
          >
            &#x2715;
          </button>
        </div>

        <hr className="mb-2" />

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <input {...register("name")} className="border p-2 w-full rounded" />
          <input {...register("email")} className="border p-2 w-full rounded" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-blue-500 px-3 py-1 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/userService";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(user);

  const handleUpdate = async () => {
    try {
      await updateUser(user.id, form);
      toast.success("Profile Updated");
    } catch {
      toast.error("Update Failed");
    }
  };

  return (
    <div>
      <h2>Profile</h2>

      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
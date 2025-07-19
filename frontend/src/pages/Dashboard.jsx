import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    ifscCode: "",
    branchName: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get("https://threew-round-2-task.onrender.com/api/banks", { headers })
      .then((res) => setAccounts(res.data))
      .catch(() => toast.error("Failed to load accounts."));
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post(
        "https://threew-round-2-task.onrender.com/api/banks",
        form,
        { headers }
      );
      const res = await axios.get("https://threew-round-2-task.onrender.com/api/banks", {
        headers,
      });
      setAccounts(res.data);
      toast.success("Account added successfully!");
    } catch (err) {
      console.error("Error adding account:", err);
      toast.error("Error adding account.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://threew-round-2-task.onrender.com/api/banks/${id}`,
        { headers }
      );
      setAccounts(accounts.filter((acc) => acc._id !== id));
      toast.success("Account deleted successfully!");
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Error deleting account.");
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">User Dashboard</h2>

      <div className="form-container">
        <input
          className="form-input"
          placeholder="IFSC Code"
          onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Branch"
          onChange={(e) => setForm({ ...form, branchName: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Bank Name"
          onChange={(e) => setForm({ ...form, bankName: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Account Number"
          onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Holder Name"
          onChange={(e) =>
            setForm({ ...form, accountHolderName: e.target.value })
          }
        />
        <button className="form-button" onClick={handleAdd}>
          Add Account
        </button>
      </div>

      <ul className="account-list">
        {accounts.map((acc) => (
          <li key={acc._id} className="account-item">
            <span className="account-info">
              {acc.bankName} - {acc.accountNumber}
            </span>
            <button
              className="delete-button"
              onClick={() => handleDelete(acc._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Toast notification container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [allAccounts, setAllAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    ifscCode: "",
    branchName: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/banks/admin/all", { headers })
      .then((res) => setAllAccounts(res.data))
      .catch((err) => {
        console.error("Error fetching accounts", err);
        setError("Failed to load accounts. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const startEdit = (acc) => {
    setEditId(acc._id);
    setEditForm({
      ifscCode: acc.ifscCode,
      branchName: acc.branchName,
      bankName: acc.bankName,
      accountNumber: acc.accountNumber,
      accountHolderName: acc.accountHolderName,
    });
    setFormErrors({});
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({
      ifscCode: "",
      branchName: "",
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    const { bankName, accountNumber, accountHolderName, ifscCode, branchName } =
      editForm;

    if (!bankName) errors.bankName = "Bank name is required.";
    if (!accountNumber) {
      errors.accountNumber = "Account number is required.";
    } else if (!/^\d{9,18}$/.test(accountNumber)) {
      errors.accountNumber = "Must be 9 to 18 digits.";
    }

    if (!accountHolderName)
      errors.accountHolderName = "Account holder is required.";

    if (!ifscCode) {
      errors.ifscCode = "IFSC code is required.";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode)) {
      errors.ifscCode = "Invalid IFSC format.";
    }

    if (!branchName) errors.branchName = "Branch name is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await axios.put(`http://localhost:5000/api/banks/${editId}`, editForm, {
        headers,
      });
      fetchAccounts();
      cancelEdit();
    } catch (err) {
      console.error("Error updating account", err);
      alert("Failed to update account.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = allAccounts.filter(
    (acc) =>
      acc.bankName?.toLowerCase().includes(search.toLowerCase()) ||
      acc.ifscCode?.toLowerCase().includes(search.toLowerCase()) ||
      acc.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <h2 className="admin-title">Admin Panel</h2>

      <input
        className="admin-search"
        placeholder="Search by user, IFSC, bank"
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="admin-loading">Loading...</p>
      ) : error ? (
        <p className="admin-error">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="admin-empty">No matching accounts found.</p>
      ) : (
        <ul className="admin-list">
          {filtered.map((acc) => (
            <li key={acc._id} className="admin-item">
              {editId === acc._id ? (
                <div className="edit-form">
                  <input
                    value={editForm.bankName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bankName: e.target.value })
                    }
                    placeholder="Bank Name"
                    className="form-input"
                  />
                  {formErrors.bankName && (
                    <span className="form-error">{formErrors.bankName}</span>
                  )}

                  <input
                    value={editForm.accountNumber}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Account Number"
                    className="form-input"
                  />
                  {formErrors.accountNumber && (
                    <span className="form-error">
                      {formErrors.accountNumber}
                    </span>
                  )}

                  <input
                    value={editForm.accountHolderName}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        accountHolderName: e.target.value,
                      })
                    }
                    placeholder="Account Holder"
                    className="form-input"
                  />
                  {formErrors.accountHolderName && (
                    <span className="form-error">
                      {formErrors.accountHolderName}
                    </span>
                  )}

                  <input
                    value={editForm.ifscCode}
                    onChange={(e) =>
                      setEditForm({ ...editForm, ifscCode: e.target.value })
                    }
                    placeholder="IFSC"
                    className="form-input"
                  />
                  {formErrors.ifscCode && (
                    <span className="form-error">{formErrors.ifscCode}</span>
                  )}

                  <input
                    value={editForm.branchName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, branchName: e.target.value })
                    }
                    placeholder="Branch"
                    className="form-input"
                  />
                  {formErrors.branchName && (
                    <span className="form-error">{formErrors.branchName}</span>
                  )}

                  <button
                    onClick={handleUpdate}
                    className="save-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                  <button onClick={cancelEdit} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="admin-info">
                    <strong>{acc.user?.username}</strong> | {acc.bankName} |{" "}
                    {acc.accountNumber} | IFSC: {acc.ifscCode}
                  </span>
                  <button className="edit-btn" onClick={() => startEdit(acc)}>
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";

type User = {
  id: number;
  nama: string;
  email: string;
  password: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formNama, setFormNama] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Load data user dari API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Gagal load data user");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormNama("");
    setFormEmail("");
    setFormPassword("");
    setEditId(null);
  };

  // Submit form (create atau update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formNama || !formEmail || !formPassword) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      if (editId === null) {
        // Create new user
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: formNama,
            email: formEmail,
            password: formPassword,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Gagal membuat user");
          return;
        }
      } else {
        // Update existing user
        const res = await fetch(`/api/users/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: formNama,
            email: formEmail,
            password: formPassword,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Gagal mengupdate user");
          return;
        }
      }

      resetForm();
      fetchUsers();
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  // Edit user (isi form)
  const handleEdit = (user: User) => {
    setFormNama(user.nama);
    setFormEmail(user.email);
    setFormPassword(user.password);
    setEditId(user.id);
  };

  // Delete user
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Gagal menghapus user");
        return;
      }
      fetchUsers();
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>User Management</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h2>{editId === null ? "Tambah User Baru" : "Edit User"}</h2>
        <div style={{ marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="Nama"
            value={formNama}
            onChange={(e) => setFormNama(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <input
            type="password"
            placeholder="Password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          {editId === null ? "Tambah User" : "Update User"}
        </button>

        {editId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: 8, padding: "8px 16px", cursor: "pointer" }}
          >
            Batal
          </button>
        )}
      </form>

      <h2>Daftar User</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : users.length === 0 ? (
        <p>Belum ada user</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Nama</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Email</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Password</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.id}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.nama}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.email}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.password}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <button onClick={() => handleEdit(user)} style={{ marginRight: 8, cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} style={{ cursor: "pointer" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

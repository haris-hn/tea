import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Users, Shield, ShieldAlert, UserCheck, UserX, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      await api.put(`/users/${userId}/block`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle block status");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 text-center text-xs font-bold tracking-widest uppercase text-gray-400">Loading Users...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">User Management</h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">
            Access Control & Role Assignment
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-100 focus:border-black focus:ring-0 text-xs font-bold uppercase tracking-widest bg-gray-50/50 w-full md:w-64"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">User</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Role</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-none border border-gray-200">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{u.name}</p>
                        <p className="text-[10px] font-medium text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                        {u.role === 'superadmin' ? (
                            <ShieldAlert className="w-4 h-4 text-emerald-600" />
                        ) : u.role === 'admin' ? (
                            <Shield className="w-4 h-4 text-blue-600" />
                        ) : (
                            <Users className="w-4 h-4 text-gray-400" />
                        )}
                        {currentUser?.role === 'superadmin' && u._id !== currentUser._id ? (
                            <select 
                                value={u.role} 
                                onChange={(e) => handleChangeRole(u._id, e.target.value)}
                                className="text-[10px] font-bold uppercase tracking-widest border-none bg-transparent focus:ring-0 p-0 cursor-pointer"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{u.role}</span>
                        )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-block px-3 py-1 text-[9px] font-bold tracking-widest uppercase ${u.isBlocked ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {currentUser?.role === 'superadmin' && u._id !== currentUser._id && (
                        <button 
                            onClick={() => handleToggleBlock(u._id)}
                            className={`p-2 transition-colors ${u.isBlocked ? "text-emerald-500 hover:bg-emerald-50" : "text-red-400 hover:bg-red-50"}`}
                            title={u.isBlocked ? "Unblock User" : "Block User"}
                        >
                            {u.isBlocked ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-[10px] font-bold text-gray-300 tracking-widest uppercase">
            No matching users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

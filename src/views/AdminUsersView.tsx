import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  UserCheck,
  UserX,
  CreditCard,
  Phone,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { User, UserRole } from '../types';

export const AdminUsersView: React.FC = () => {
  const {
    users,
    toggleUserAccountStatus,
    addNewUser,
    navigateTo,
    liveDateTime
  } = useSecurity();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New user form state
  const [newName, setNewName] = useState<string>('');
  const [newCardNumber, setNewCardNumber] = useState<string>('5544332211004455');
  const [newPhone, setNewPhone] = useState<string>('9840199999');
  const [newRole, setNewRole] = useState<UserRole>('STUDENT');
  const [newDept, setNewDept] = useState<string>('Computer Science & Engineering');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const maskedCard = `**** **** **** ${newCardNumber.slice(-4)}`;
    const maskedPhone = `******${newPhone.slice(-4)}`;
    const cardId = `CRD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newUser: User = {
      userId: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      cardId,
      cardNumber: newCardNumber,
      maskedCardNumber: maskedCard,
      phoneNumber: newPhone,
      maskedPhoneNumber: maskedPhone,
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@univ.edu`,
      faceImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      accountStatus: 'ACTIVE',
      role: newRole,
      department: newDept,
      lastAccessDate: liveDateTime.date,
      lastAccessTime: liveDateTime.time,
      lastAccessLocation: 'Enrollment Kiosk',
      atmBalance: 15000,
      pinCode: '123456'
    };

    addNewUser(newUser);
    setShowAddModal(false);
    setNewName('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-purple-50/50 to-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('ADMIN_DASHBOARD')}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                User Identity & Token Registry
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage enrolled smart cards, mobile OTP bindings, and security clearance statuses
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll New Identity</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-indigo-200/80 p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search user name, card token, or role..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <span className="text-xs font-mono text-slate-500">
            {filteredUsers.length} Enrolled Identities
          </span>
        </div>

        {/* User Table */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Card ID</th>
                  <th className="py-3.5 px-4">Masked Card</th>
                  <th className="py-3.5 px-4">Masked Phone (OTP)</th>
                  <th className="py-3.5 px-4">Role & Dept</th>
                  <th className="py-3.5 px-4">Demo Balance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredUsers.map(u => (
                  <tr key={u.userId} className="hover:bg-slate-50/80 transition">
                    
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.faceImageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-indigo-700">{u.cardId}</td>
                    <td className="py-3 px-4 text-slate-700">{u.maskedCardNumber}</td>
                    <td className="py-3 px-4 text-slate-700">{u.maskedPhoneNumber}</td>
                    
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      <div className="font-bold text-slate-800">{u.role}</div>
                      <div className="text-[10px] text-slate-400">{u.department}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-600">
                      ₹{(u.atmBalance || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.accountStatus === 'LOCKED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.accountStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap font-sans">
                      <button
                        onClick={() => toggleUserAccountStatus(u.userId)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition ${
                          u.accountStatus === 'ACTIVE'
                            ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                            : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.accountStatus === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900">Enroll New Demo Identity</h3>
            <p className="mt-1 text-xs text-slate-500">Register new card token, mobile number, and biometric entry.</p>

            <form onSubmit={handleCreateUser} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">16-Digit Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={newCardNumber}
                  onChange={e => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number (OTP)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="RESEARCHER">RESEARCHER</option>
                    <option value="FACULTY">FACULTY</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                >
                  Save & Provision Token
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-slate-400 font-mono">
        <span>Identity Governance & Access Administration Module</span>
      </div>

    </div>
  );
};

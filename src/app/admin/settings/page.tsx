"use client";

import { createUser, deleteUser, getAllUsers, toggleUserStatus, updateUser, type ActionResponse } from "@/app/actions/users";
import { ProtectedDashboard } from "@/components/dashboard";
import { LoadingSpinner } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    Bell,
    Bot,
    Check,
    Globe,
    Pencil,
    Plus,
    Settings as SettingsIcon,
    Shield,
    Trash2,
    Users,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "interviewer" | "recruiter";
  phone: string | null;
  department: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
};

type ModalMode = "create" | "edit" | null;

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("users");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  // Fetch users
  useEffect(() => {
    loadUsers(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const handleCreateUser = () => {
    setModalMode("create");
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: UserData) => {
    setModalMode("edit");
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSubmitUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    
    const promise = modalMode === "create" 
      ? createUser(formData)
      : updateUser(formData);

    toast.promise(promise, {
      loading: `${modalMode === "create" ? "Creating" : "Updating"} user...`,
      success: (result: ActionResponse) => {
        if (result.success) {
          setShowUserModal(false);
          setModalMode(null);
          setSelectedUser(null);
          loadUsers();
          return `User ${modalMode === "create" ? "created" : "updated"} successfully!`;
        }
        throw new Error(result.error || "Operation failed");
      },
      error: (error: Error) => error.message,
    });

    setSubmitting(false);
  };

  const handleDeleteUser = async (userId: string) => {
    const promise = deleteUser(userId);
    
    toast.promise(promise, {
      loading: "Deleting user...",
      success: (result: ActionResponse) => {
        if (result.success) {
          setDeleteConfirm(null);
          loadUsers();
          return "User deleted successfully!";
        }
        throw new Error(result.error || "Failed to delete user");
      },
      error: (error: Error) => error.message,
    });
  };

  const handleToggleStatus = async (userId: string) => {
    const promise = toggleUserStatus(userId);
    
    toast.promise(promise, {
      loading: "Updating status...",
      success: (result: ActionResponse) => {
        if (result.success) {
          loadUsers();
          return "User status updated!";
        }
        throw new Error(result.error || "Failed to update status");
      },
      error: (error: Error) => error.message,
    });
  };

  const sections = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "ai", label: "AI Configuration", icon: Bot },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const roleColors: Record<string, string> = {
    admin: "bg-purple-500/10 text-purple-600",
    interviewer: "bg-blue-500/10 text-blue-600",
    recruiter: "bg-green-500/10 text-green-600",
  };

  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your recruitment platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Settings Sidebar */}
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Settings</h3>
          <ScrollArea className="w-full lg:w-auto">
            <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
            <ScrollBar orientation="horizontal" className="lg:hidden" />
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="col-span-3 space-y-6">
          {activeSection === "users" && (
            <>
              {/* Team Members Section */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">Team Members</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Manage your team members and their roles
                    </p>
                  </div>
                  <Button onClick={handleCreateUser} size="sm" className="text-xs sm:text-sm">
                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                    Add User
                  </Button>
                </div>

                {loading ? (
                  <div className="p-8 sm:p-12 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <ScrollArea className="w-full">
                    <table className="w-full min-w-[700px]">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                            User
                          </th>
                          <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                            Role
                          </th>
                          <th className="text-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="text-right px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm sm:text-base shrink-0">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground text-sm sm:text-base truncate">{user.name}</p>
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span
                                className={cn(
                                  "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize",
                                  roleColors[user.role]
                                )}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                              <button
                                onClick={() => handleToggleStatus(user.id)}
                                className={cn(
                                  "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium",
                                  user.isActive
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-gray-500/10 text-gray-600"
                                )}
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </button>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div className="flex items-center justify-end gap-1 sm:gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                  className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                                >
                                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                  <span className="hidden sm:inline">Edit</span>
                                </Button>
                                {deleteConfirm === user.id ? (
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                                    >
                                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setDeleteConfirm(null)}
                                      className="h-7 sm:h-8 px-2 sm:px-3"
                                    >
                                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteConfirm(user.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                    <span className="hidden sm:inline">Remove</span>
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}
              </div>
            </>
          )}

          {activeSection === "general" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Tech Innovations Inc."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time Zone
                  </label>
                  <Select defaultValue="asia-singapore">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                      <SelectItem value="america-new-york">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "ai" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">AI Configuration</h2>
              <p className="text-sm text-muted-foreground">Configure AI-powered features</p>
            </div>
          )}

          {activeSection === "integrations" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Integrations</h2>
              <p className="text-sm text-muted-foreground">Connect external services</p>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h2>
              <p className="text-sm text-muted-foreground">Manage notification preferences</p>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>
              <p className="text-sm text-muted-foreground">Configure security options</p>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmitUser}>
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  {modalMode === "create" ? "Add New User" : "Edit User"}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {modalMode === "edit" && selectedUser && (
                  <input type="hidden" name="id" value={selectedUser.id} />
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedUser?.name || ""}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={selectedUser?.email || ""}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="john@company.com"
                  />
                </div>

                {modalMode === "create" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      required={modalMode === "create"}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="••••••••"
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role *
                  </label>
                  <Select
                    name="role"
                    defaultValue={selectedUser?.role || "recruiter"}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="interviewer">Interviewer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={selectedUser?.phone || ""}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="+65 9123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={selectedUser?.department || ""}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Engineering"
                  />
                </div>

                {modalMode === "edit" && selectedUser && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      defaultChecked={selectedUser.isActive}
                      value="true"
                      className="rounded border-border"
                    />
                    <label htmlFor="isActive" className="text-sm text-foreground">
                      Active user
                    </label>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUserModal(false);
                    setModalMode(null);
                    setSelectedUser(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {modalMode === "create" ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    modalMode === "create" ? "Create User" : "Update User"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedDashboard>
  );
}

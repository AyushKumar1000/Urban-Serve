import { AuthUser, UserRole } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getUsers = (): AuthUser[] => {
  const usersStr = localStorage.getItem("mock_users");
  return usersStr ? JSON.parse(usersStr) : [];
};

const saveUsers = (users: AuthUser[]) => {
  localStorage.setItem("mock_users", JSON.stringify(users));
};

export const loginApi = async (email: string, password: string, role: UserRole): Promise<AuthUser> => {
  await delay(800);
  const users = getUsers();
  const user = users.find(u => u.email === email && u.role === role);
  if (!user) {
    throw new Error("Invalid credentials or user not found");
  }
  return user;
};

export const signupApi = async (data: Partial<AuthUser> & { password: string }, role: UserRole): Promise<AuthUser> => {
  await delay(800);
  const users = getUsers();
  if (users.find(u => u.email === data.email)) {
    throw new Error("User already exists with this email");
  }
  
  const newUser: AuthUser = {
    id: Math.random().toString(36).substring(7),
    role,
    name: data.name || "",
    email: data.email,
    phone: data.phone || "",
    serviceCategory: data.serviceCategory,
    approvalStatus: role === "service_team" ? "pending" : undefined,
  };
  
  saveUsers([...users, newUser]);
  return newUser;
};

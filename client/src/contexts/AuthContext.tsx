import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  logoutAllDevices,
  selectUserRole,
  type User,
  type RegisterPayload,
  type LoginPayload,
} from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/types/auth.types";

// ── Types ────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsRoleSelection: boolean; // ← NEW
}

interface AuthContextType extends AuthState {
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>; // ← NEW
}

// ── Context ──────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ─────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    needsRoleSelection: false,
  });

  // ── Initialize: OAuth query params + existing session ──
  const initializeAuth = useCallback(async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      const urlError = params.get("error");
      const urlIsNewUser = params.get("isNewUser");

      const stripSearchParams = (keys: string[]) => {
        for (const k of keys) params.delete(k);
        const q = params.toString();
        const path = `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`;
        window.history.replaceState(null, "", path);
      };

      if (urlError) {
        let description = urlError;
        try {
          description = decodeURIComponent(urlError);
        } catch {
          /* keep raw */
        }
        toast({
          title: "Authentication failed",
          description,
          variant: "destructive",
        });
        stripSearchParams(["error"]);
      }

      let oauthJustCompleted = false;
      let oauthIsNewUser = false;

      if (urlToken) {
        localStorage.setItem("accessToken", urlToken);
        oauthJustCompleted = true;
        oauthIsNewUser = urlIsNewUser === "true";
        stripSearchParams(["token", "isNewUser"]);
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          needsRoleSelection: false,
        });
        return;
      }

      const response = await getCurrentUser();
      const user = response.data.user;

      // ── CHECK: Does user need role selection? ──
      const needsRole = user.role === null;

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        needsRoleSelection: needsRole,
      });

      if (oauthJustCompleted && !needsRole) {
        toast({
          title: oauthIsNewUser ? "Welcome! 🎉" : "Welcome back! 👋",
          description: oauthIsNewUser
            ? "Your account has been created successfully."
            : "You've been logged in successfully.",
        });
      }
    } catch {
      localStorage.removeItem("accessToken");
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        needsRoleSelection: false,
      });
    }
  }, [toast]);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  // ── Register ────────────────────────────────────────
  const register = async (payload: RegisterPayload): Promise<void> => {
    const response = await registerUser(payload);
    localStorage.setItem("accessToken", response.data.accessToken);
    setState({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
      needsRoleSelection: false,
    });
  };

  // ── Login ───────────────────────────────────────────
  const login = async (payload: LoginPayload): Promise<void> => {
    const response = await loginUser(payload);
    localStorage.setItem("accessToken", response.data.accessToken);

    const user = response.data.user;
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      needsRoleSelection: user.role === null,
    });
  };

  // ── Select Role (NEW) ──────────────────────────────
  const selectRole = async (role: UserRole): Promise<void> => {
    const response = await selectUserRole(role);
    localStorage.setItem("accessToken", response.data.accessToken);
    setState({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
      needsRoleSelection: false,
    });
  };

  // ── Logout ──────────────────────────────────────────
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch {
      // Even if API fails, clear local state
    } finally {
      localStorage.removeItem("accessToken");
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        needsRoleSelection: false,
      });
    }
  };

  // ── Logout All Devices ──────────────────────────────
  const logoutAll = async (): Promise<void> => {
    try {
      await logoutAllDevices();
    } catch {
      // Even if API fails, clear local state
    } finally {
      localStorage.removeItem("accessToken");
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        needsRoleSelection: false,
      });
    }
  };

  // ── Refresh User Data ──────────────────────────────
  const refreshUser = async (): Promise<void> => {
    try {
      const response = await getCurrentUser();
      const user = response.data.user;
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        needsRoleSelection: user.role === null,
      });
    } catch {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        needsRoleSelection: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        logoutAll,
        refreshUser,
        selectRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

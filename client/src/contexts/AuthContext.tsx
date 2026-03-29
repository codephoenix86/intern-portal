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
  type User,
  type RegisterPayload,
  type LoginPayload,
} from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

// ── Types ────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
  });

  // ── Initialize: OAuth query params + existing session ──
  // OAuth redirects to /student|mentor|recruiter?token=... before any dashboard
  // mounts. ProtectedRoute would redirect to /login unless we persist the token
  // here (same tick as first /auth/me), not inside a nested useEffect.
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
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const response = await getCurrentUser();
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      if (oauthJustCompleted) {
        toast({
          title: oauthIsNewUser ? "Welcome! 🎉" : "Welcome back! 👋",
          description: oauthIsNewUser
            ? "Your account has been created successfully."
            : "You've been logged in successfully.",
        });
      }
    } catch {
      localStorage.removeItem("accessToken");
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [toast]);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  // ── Register ────────────────────────────────────────
  const register = async (payload: RegisterPayload): Promise<void> => {
    const response = await registerUser(payload);

    // Store access token
    localStorage.setItem("accessToken", response.data.accessToken);

    // Update state
    setState({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // ── Login ───────────────────────────────────────────
  const login = async (payload: LoginPayload): Promise<void> => {
    const response = await loginUser(payload);

    // Store access token
    localStorage.setItem("accessToken", response.data.accessToken);

    // Update state
    setState({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
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
      setState({ user: null, isAuthenticated: false, isLoading: false });
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
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  // ── Refresh User Data ──────────────────────────────
  const refreshUser = async (): Promise<void> => {
    try {
      const response = await getCurrentUser();
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      setState({ user: null, isAuthenticated: false, isLoading: false });
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

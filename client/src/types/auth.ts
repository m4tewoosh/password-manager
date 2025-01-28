export type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  registerAction: (email: string, password: string) => Promise<void>;
  loginAction: (email: string, password: string) => Promise<void>;
  logoutAction: () => Promise<void>;
};

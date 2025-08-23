import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearStorage,
  loadNameFromStorage,
  loadRoleFromStorage,
  saveNameToStorage,
  saveRoleToStorage,
} from "./AuthUtil";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [name, setName] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedName = loadNameFromStorage();
    const storedRole = loadRoleFromStorage();

    if (storedName) setName(storedName);
    if (storedRole) setName(storedName);
  }, []);

  const login = useCallback(({ name, role }) => {
    console.log("로그인 함수 실행됨");
    saveNameToStorage(name);
    saveRoleToStorage(role);
    setName(name);
    setRole(role);
  }, []);

  const logout = useCallback(() => {
    setName(null);
    setRole(null);
    clearStorage();
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({ name, role, login, logout }),
    [name, role, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

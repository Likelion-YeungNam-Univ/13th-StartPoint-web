/**세션 스토리지에서 이름 가져오기 */
export const loadNameFromStorage = () => {
  try {
    const storedName = sessionStorage.getItem("name");
    return storedName;
  } catch (err) {
    console.error("세션 스토리지에서 이름을 가져오는 중 오류: ", err);
    sessionStorage.removeItem("name");
    return null;
  }
};

/**세션 스토리지에서 역할 가져오기 */
export const loadRoleFromStorage = () => {
  try {
    const storedRole = sessionStorage.getItem("role");
    return storedRole;
  } catch (err) {
    console.error("세션 스토리지에서 역할을 가져오는 중 오류: ", err);
    sessionStorage.removeItem("role");
    return null;
  }
};

/**세션 스토리지에 이름 저장하기 */
export const saveNameToStorage = (name) => {
  try {
    sessionStorage.setItem("name", name);
  } catch (err) {
    console.error("세션 스토리지에서 이름을 저장하는 중 오류: ", err);
    sessionStorage.removeItem("name");
    return null;
  }
};

/**세션 스토리지에 역할 저장하기 */
export const saveRoleToStorage = (role) => {
  try {
    sessionStorage.setItem("role", role);
  } catch (err) {
    console.error("세션 스토리지에서 역할을 저장하는 중 오류: ", err);
    sessionStorage.removeItem("role");
    return null;
  }
};

/**세션 스토리지 비우기 */
export const clearStorage = () => {
  sessionStorage.removeItem("name");
  sessionStorage.removeItem("role");
};

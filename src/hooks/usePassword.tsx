import { useMemo } from "react";

export const usePassword = ({
  password,
}: {
  password: string;
}) => {
  const validation = useMemo(() => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
      isLong: password.length >= 8,
    };
  }, [password]);
  return {
    validation,
  };
};

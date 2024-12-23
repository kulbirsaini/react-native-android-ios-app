export const isValidPassword = (password: string) => {
  return password && password.trim().length >= 6;
};

export const isValidEmail = (email: string) => {
  return email && email.trim().includes("@");
};

export const isValidOtp = (otp: string) => {
  return otp && otp.match(/^[0-9]{6}$/);
};

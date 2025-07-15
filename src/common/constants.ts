export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;

export const ACCESS_TOKEN = {
  name: "access_token",
  expire_at: 1 * 24 * 60 * 60 * 1000,
};

export const REFRESH_TOKEN = {
  name: "refresh_token",
  expire_at: 3 * 24 * 60 * 60 * 1000,

  options: {
    httpOnly: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  },
};

export enum RefundStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
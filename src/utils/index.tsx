



export const CheckRole = {
  ADMIN: 1,
  QUANLY: 2,
  TUVAN: 3,
  GOOGLE: 4,
} as const;

// staff là nhân viên phòng khám, customer là khách hàng
export const SENDER_TYPE = {
  CUSTOMER: "customer",
  STAFF: "staff",
  AUTO: "auto",
  AI: "AI",
} as const;

export const ProviderEnum = {
  LOCAL: 'local',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  GITHUB: 'github',
  APPLE: 'apple',
} as const;


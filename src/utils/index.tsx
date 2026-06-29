

export const CheckRole = {
  OWNER: 1,
  ADMIN_MANAGE: 2,
  SALE: 3,
  CSKH: 4,
} as const;

// staff là nhân viên phòng khám, customer là khách hàng
export const MessageDirection = {
  CUSTOMER: "customer",
  STAFF: "staff",
  AUTO: "auto",
  AI: "ai",
} as const;

export const ProviderEnum = {
  LOCAL: 'local',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  GITHUB: 'github',
  APPLE: 'apple',
} as const;

export const ProviderEnumData = [
  { value: 'local', label: 'Tài khoản hệ thống' },
  { value: 'google', label: 'Google' },
  { value: 'facebook', label: 'Facebook' },
] as const;

export const RoleData = [
  { value: 'Admin Manager', label: 'Quản trị viên' },
  { value: 'CSKH', label: 'Chăm sóc khách hàng' },
  { value: 'Sale', label: 'Nhân viên sale' },
] as const

export const SyncStatus = {
  PENDING: 'pending', //Chưa đồng bộ
  SYNCING: 'syncing', //Đang đồng bộ...
  SUCCESS: 'success', // Đồng bộ thành công
  FAILED: 'failed',//  Đồng bộ thất bại
} as const;


export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  FILE: 'file',
  STICKER: 'sticker',
} as const

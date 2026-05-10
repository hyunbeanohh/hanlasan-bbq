export interface Inquiry {
  id: number;
  parentId: number | null;
  isAdmin: boolean;
  authorName: string;
  passwordHash: string | null;
  passwordSalt: string | null;
  phoneEnc: string;
  emailEnc: string;
  title: string;
  content: string;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface InquiryRow {
  id: number;
  parent_id: number | null;
  is_admin: number;
  author_name: string;
  password_hash: string | null;
  password_salt: string | null;
  phone_enc: string;
  email_enc: string;
  title: string;
  content: string;
  is_secret: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export function rowToInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    parentId: row.parent_id,
    isAdmin: row.is_admin === 1,
    authorName: row.author_name,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    phoneEnc: row.phone_enc,
    emailEnc: row.email_enc,
    title: row.title,
    content: row.content,
    isSecret: row.is_secret === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}

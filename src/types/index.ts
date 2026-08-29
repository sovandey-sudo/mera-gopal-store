// Shared TypeScript types will be expanded in later phases

export type Role = "SUPER_ADMIN" | "ADMIN" | "CUSTOMER";

export interface ProductBasic {
  id: string;
  name: string;
  slug: string;
  price: number;
  // ... more fields in Phase 2
}

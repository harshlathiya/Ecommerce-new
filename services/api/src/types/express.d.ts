import type { UserRole } from "@ecom/utils";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        storeId?: string;
      };
      storeId?: string;
    }
  }
}

export {};

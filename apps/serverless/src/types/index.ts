export interface User {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: {
      status: string;
      strategy: string;
      expiresAt: string;
    };
  }>;
  primaryEmailAddressId: string | null;
  primaryEmailAddress: {
    id: string;
    emailAddress: string;
    verification: {
      status: string;
      strategy: string;
      expiresAt: string;
    };
  } | null;
  imageUrl: string;
  hasImage: boolean;
  publicMetadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  lastSignInAt: string;
}

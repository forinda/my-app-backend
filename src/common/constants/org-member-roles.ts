export const orgMemberRoles = [
  'Admin',
  'Member',
  'Manager',
  'Owner',
  'Guest'
] as const;

export type OrgMemberRole = (typeof orgMemberRoles)[number];

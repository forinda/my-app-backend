import z from 'zod';
export const SubscriptionTypeSchema = z.enum([
  'starter',
  'team',
  'business',
  'enterprise'
]);

// const extractObjectKeys = <T extends Record<string, any>>(obj: T) =>
//   Object.keys(obj) as (keyof T)[];
// const extracted = extractObjectKeys(currencies) as string[];
const curencySchema = z.enum([
  'KES',
  'USD',
  'EUR',
  'GBP',
  'NGN',
  'ZAR',
  'UGX',
  'TZS',
  'RWF',
  'GHS',
  'ZMW',
  'MAD',
  'XAF',
  'XOF',
  'XAF'
]);

export const CreateSubscriptionPlanSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  maximum_users: z.number().int().nonnegative(),
  maximum_projects: z.number().int().nonnegative(),
  per_user_monthly_price: z.number().int().nonnegative(),
  annual_discount: z.number().int().nonnegative(),
  currency: curencySchema,
  trial_period_days: z.number().int().nonnegative(),
  type: SubscriptionTypeSchema,
  cta: z.string().nonempty()
});

export const CreateSubscriptionFeatureSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  is_active: z.boolean()
});

export type SubscriptionPlan = z.infer<typeof CreateSubscriptionPlanSchema>;

export type SubscriptionFeature = z.infer<
  typeof CreateSubscriptionFeatureSchema
>;

export type SubscriptionType = z.infer<typeof SubscriptionTypeSchema>;

export type Currency = z.infer<typeof curencySchema>;

import type { SubscriptionType } from '../schema/schema';

export const subscriptionPlans: Record<
  SubscriptionType,
  {
    name: string;
    description: string;
    maximum_users: number;
    maximum_projects: number;
    per_user_monthly_price: number;
    annual_discount: number;
    currency: string;
    trial_period_days: number;
    features: Record<
      string,
      {
        name: string;
        description: string;
        is_active: boolean;
      }
    >;
  }
> = {
  starter: {
    name: 'Starter',
    description: 'Perfect for small teams just getting started',
    maximum_users: 3,
    maximum_projects: 1,
    per_user_monthly_price: 9,
    annual_discount: 17,
    currency: 'USD',
    trial_period_days: 14,
    features: {
      basic_time_tracking: {
        name: 'Basic Time Tracking',
        description: 'Track time for tasks and projects',
        is_active: true
      },
      task_management: {
        name: 'Task Management',
        description: 'Manage tasks with ease',
        is_active: true
      },
      project_management: {
        name: 'Project Management',
        description: 'Manage up to 1 project',
        is_active: true
      },
      basic_chat: {
        name: 'Basic Chat Functionality',
        description: 'Communicate with your team',
        is_active: true
      },
      email_support: {
        name: 'Email Support',
        description: 'Get help via email',
        is_active: true
      }
    }
  },
  team: {
    name: 'Team',
    description: 'For growing teams that need more flexibility',
    maximum_users: 10,
    maximum_projects: 5,
    per_user_monthly_price: 19,
    annual_discount: 17,
    currency: 'USD',
    trial_period_days: 14,
    features: {
      advanced_time_tracking: {
        name: 'Advanced Time Tracking',
        description: 'Track time with detailed reports',
        is_active: true
      },
      task_priorities: {
        name: 'Task Priorities',
        description: 'Set priorities for tasks',
        is_active: true
      },
      project_management: {
        name: 'Project Management',
        description: 'Manage up to 5 projects',
        is_active: true
      },
      team_chat: {
        name: 'Team Chat with File Sharing',
        description: 'Communicate and share files with your team',
        is_active: true
      },
      basic_payroll: {
        name: 'Basic Payroll Processing',
        description: 'Process payroll for your team',
        is_active: true
      },
      hr_document_storage: {
        name: 'HR Document Storage',
        description: 'Store HR documents securely',
        is_active: true
      },
      priority_email_support: {
        name: 'Priority Email Support',
        description: 'Get faster email support',
        is_active: true
      }
    }
  },
  business: {
    name: 'Business',
    description: 'For established businesses with complex needs',
    maximum_users: 25,
    maximum_projects: Number.POSITIVE_INFINITY, // Unlimited projects
    per_user_monthly_price: 39,
    annual_discount: 17,
    currency: 'USD',
    trial_period_days: 14,
    features: {
      comprehensive_time_tracking: {
        name: 'Comprehensive Time Tracking',
        description: 'Track time with advanced reporting',
        is_active: true
      },
      task_dependencies: {
        name: 'Task Dependencies',
        description: 'Set dependencies between tasks',
        is_active: true
      },
      unlimited_projects: {
        name: 'Unlimited Projects',
        description: 'Manage unlimited projects',
        is_active: true
      },
      team_chat_video: {
        name: 'Team Chat with Video Calls',
        description: 'Communicate with video calls',
        is_active: true
      },
      full_payroll: {
        name: 'Full Payroll Processing',
        description: 'Process payroll with advanced features',
        is_active: true
      },
      hr_management: {
        name: 'HR Management',
        description: 'Manage HR processes with onboarding tools',
        is_active: true
      },
      department_management: {
        name: 'Department Management',
        description: 'Manage departments within your organization',
        is_active: true
      },
      phone_email_support: {
        name: 'Phone & Email Support',
        description: 'Get support via phone and email',
        is_active: true
      }
    }
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    maximum_users: Number.POSITIVE_INFINITY, // Unlimited users
    maximum_projects: Number.POSITIVE_INFINITY, // Unlimited projects
    per_user_monthly_price: 79,
    annual_discount: 17,
    currency: 'USD',
    trial_period_days: 14,
    features: {
      custom_time_tracking: {
        name: 'Custom Time Tracking Solutions',
        description: 'Tailored time tracking for your needs',
        is_active: true
      },
      enterprise_task_management: {
        name: 'Enterprise-Grade Task Management',
        description: 'Advanced task management for large teams',
        is_active: true
      },
      advanced_project_analytics: {
        name: 'Advanced Project Analytics',
        description: 'Get insights into project performance',
        is_active: true
      },
      secure_communication: {
        name: 'Secure Communication Platform',
        description: 'Communicate securely with your team',
        is_active: true
      },
      advanced_payroll: {
        name: 'Advanced Payroll with Tax Calculations',
        description: 'Process payroll with tax calculations',
        is_active: true
      },
      comprehensive_hr_suite: {
        name: 'Comprehensive HR Suite',
        description: 'Manage all HR processes in one place',
        is_active: true
      },
      custom_integrations: {
        name: 'Custom Integrations',
        description: 'Integrate with your existing tools',
        is_active: true
      },
      dedicated_account_manager: {
        name: 'Dedicated Account Manager',
        description: 'Get personalized support from an account manager',
        is_active: true
      },
      priority_support: {
        name: '24/7 Priority Support',
        description: 'Get support anytime, anywhere',
        is_active: true
      }
    }
  }
};

export interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price: number;
  timeline: string;
  features: string[];
  included: string[];
}

export const serviceTiers: ServiceTier[] = [
  {
    id: 'lite',
    name: 'Boma Lite',
    description: 'Perfect for startups and small businesses getting started online',
    price: 39000,
    timeline: 'Delivered in 1-2 weeks',
    features: [
      'Responsive web application (mobile-friendly)',
      'Up to 3 custom pages with professional design',
      'Basic SEO optimization for search engines',
      'Contact forms with email notifications',
      'Social media integration',
      '30-day support and maintenance included'
    ],
    included: [
      'Professional hosting setup with SSL certificate',
      'Domain configuration and DNS management',
      'Basic Google Analytics integration',
      'Mobile-responsive design testing',
      'Cross-browser compatibility',
      'Basic performance optimization'
    ]
  },
  {
    id: 'core',
    name: 'Boma Core',
    description: 'Full-stack solution for growing businesses with advanced needs',
    price: 145000,
    timeline: 'Delivered in 3-4 weeks',
    features: [
      'Full-stack web application with modern architecture',
      'Database integration with PostgreSQL',
      'User authentication and authorization system',
      'Custom API development and documentation',
      'Admin dashboard with user management',
      '90-day support and maintenance included'
    ],
    included: [
      'Database design and setup with optimization',
      'API documentation and testing suite',
      'User management system with roles',
      'Security implementation and best practices',
      'Performance monitoring and optimization',
      'Backup and recovery systems'
    ]
  },
  {
    id: 'prime',
    name: 'Boma Prime',
    description: 'Enterprise-grade platform for established businesses scaling up',
    price: 299000,
    timeline: 'Delivered in 6-8 weeks',
    features: [
      'Enterprise web platform with microservices',
      'Advanced analytics and business intelligence',
      'Third-party integrations (CRM, ERP, payment gateways)',
      'Custom admin panel with advanced features',
      'Advanced security and compliance features',
      '6-month support and maintenance included'
    ],
    included: [
      'Cloud infrastructure setup and optimization',
      'Performance monitoring and alerting',
      'Integration setup with existing systems',
      'Staff training sessions and documentation',
      'Advanced security audit and implementation',
      'Scalability planning and architecture review'
    ]
  },
  {
    id: 'titan',
    name: 'Boma Titan',
    description: 'Complete custom software solution for enterprise organizations',
    price: 499000,
    timeline: 'Delivered in 10-12 weeks',
    features: [
      'Custom software development from scratch',
      'Microservices architecture with containerization',
      'Cloud infrastructure setup (AWS/Azure/GCP)',
      'DevOps pipeline with CI/CD automation',
      'Advanced monitoring, logging, and alerting',
      '1-year support and maintenance included'
    ],
    included: [
      'Full DevOps setup with automated deployments',
      'Scalability planning and load testing',
      'Performance monitoring and optimization',
      'Dedicated support team and SLA',
      'Security audit and penetration testing',
      'Staff training and knowledge transfer'
    ]
  },
  {
    id: 'shop',
    name: 'Boma Shop',
    description: 'Complete e-commerce solution for online sellers and retailers',
    price: 0, // Dynamic pricing
    timeline: 'Launched in 2-3 weeks',
    features: [
      'Custom webapp frontend designed for your brand',
      'Shared backend handling orders, inventory, and analytics',
      'Product and sales management dashboard',
      'Payment integration (Mpesa, Stripe, PayPal)',
      'Hosting and maintenance included in package',
      'Optional transaction fees (1-3%) based on volume'
    ],
    included: [
      'Multi-tenant architecture for scalability',
      'Real-time analytics dashboard and reporting',
      'Payment processing setup and integration',
      'Ongoing maintenance and security updates',
      'Mobile-responsive design and optimization',
      'Customer support and training included'
    ]
  }
];
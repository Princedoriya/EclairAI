import { isDev } from './helpers'

export const pricingPlans = [
  {
    id: "free",
    name: "Free Plan",
    price: 0,
    description: "Perfect for occasional use",
    items: [
        "3 PDF summaries ", 
        "Standard processing speed ",
        "Email support",
     ],
    paymentLink: isDev
      ? ''
      : '',
    priceId: isDev
     ? 'price_1RYAAwGax1jv4fZdpy7d9tzX'
      : '',
  },
  {
    id: "pro",
    name: "Pro",
    price: 5,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    paymentLink: isDev
      ? 'https://buy.stripe.com/test_28EdR9ace2gx2VbaMx4c801'
      : 'https://buy.stripe.com/test_00w9AT98adZfeDT7Al4c802',
    priceId: isDev
      ? 'price_1RfLrKGax1jv4fZdhebP9Z2D'
      : 'price_1RfLrKGax1jv4fZdhebP9Z2D',
  },
];

export const containerVariants = {
    hidden: {opacity:0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2, 
      },
    },
};

export const itemVariants = {
    hidden: {opacity:0, y: 20},
    visible: {
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15 ,
        stiffness: 50,
        duration : 0.8, 
      },
    },
};

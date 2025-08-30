export interface Website {
  id: string;
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  githubUrl?: string;
  technologies: string[];
  category: 'personal' | 'client' | 'portfolio' | 'e-commerce' | 'real-estate' | 'restaurant' | 'luxury-brand' | 'travel' | 'business' | 'entertainment' | 'automotive' | 'jewelry' | 'education' | 'healthcare' | 'non-profit';
  featured: boolean;
  year: number;
}

export const websitesData: Website[] = [
  {
    id: '1',
    title: 'Personal Portfolio',
    description: 'A modern, responsive portfolio website built with Next.js and Tailwind CSS. Features dark mode, animations, and SEO optimization.',
    image: '/images/portfolio.png',
    liveUrl: 'https://hafida-belayd.me/',
    githubUrl: 'https://github.com/hafidaso/portfolio',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    category: 'personal',
    featured: true,
    year: 2025
  },
  {
    id: '14',
    title: 'Monaco Grand Prix Website',
    description: 'High-speed Formula One themed website design with dynamic elements and racing-inspired interface.',
    image: '/images/ticketgrandprix.png',
    liveUrl: 'https://www.ticketgrandprix.com/',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Animation Libraries', 'Payment Gateway'],
    category: 'entertainment',
    featured: false,
    year: 2025
  },
  {
    id: '5',
    title: 'BTOBExchange',
    description: 'Dynamic business matchmaking platform fostering a vibrant B2B ecosystem for networking and growth.',
    image: '/images/website-btobexchan.png',
    liveUrl: 'https://btobexchange.com/',
    technologies: ['WordPress'],
    category: 'business',
    featured: false,
    year: 2024
  },
  {
    id: '7',
    title: 'Les Pierres du Rocher Jewelry',
    description: 'Elegant website design for luxury jewelry brand Les Pierres du Rocher with sophisticated design and premium user experience.',
    image: '/images/lespieere.png',
    liveUrl: 'https://lespierresdurocher.com',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Luxury Theme'],
    category: 'jewelry',
    featured: false,
    year: 2024
  },
  {
    id: '4',
    title: ' Harroch - Real Estate Website',
    description: 'Modern real estate website design with property showcase features and advanced search functionality.',
    image: '/images/Harroch.png',
    liveUrl: 'https://www.harrochrealestate.mc',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Property Search'],
    category: 'real-estate',
    featured: false,
    year: 2024
  },
  {
    id: '9',
    title: 'Monte Carlo Cigar',
    description: 'Luxury cigar brand website design for Monte Carlo Cigar with premium aesthetics and sophisticated user interface.',
    image: '/images/davidoff.png',
    liveUrl: 'https://www.montecarlocigar.com/',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Luxury Theme'],
    category: 'luxury-brand',
    featured: true,
    year: 2024
  },
  {
    id: '10',
    title: 'Amore Mio Restaurant',
    description: 'Italian restaurant website design with warm and inviting aesthetic, featuring menu display and reservation system.',
    image: '/images/amoremio.png',
    liveUrl: 'http://amoremio.mc/',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Restaurant Theme', 'Payment Gateway'],
    category: 'restaurant',
    featured: false,
    year: 2024
  },
  {
    id: '12',
    title: 'Bubble Bar Restaurant',
    description: 'Bubble tea and bar restaurant website with playful design elements and interactive menu system.',
    image: '/images/bubblebar.png',
    liveUrl: 'https://bubblebar.mc/',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Interactive Design', 'Payment Gateway'],
    category: 'restaurant',
    featured: false,
    year: 2024
  },
  {
    id: '13',
    title: 'Aldo Monte-Carlo',
    description: 'Luxury brand website design for Aldo Monte-Carlo with premium aesthetics and sophisticated user experience.',
    image: '/images/aldo.png',
    liveUrl: 'https://shop.aldocoppola.com/',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Luxury Theme', 'Payment Gateway'],
    category: 'luxury-brand',
    featured: false,
    year: 2024
  },
  {
    id: '3',
    title: 'Bollati Immobilier',
    description: 'A multi-generational, full-service real estate agency based in Monaco, offering 44+ years of expertise across property sales, rentals, valuations, management, and renovations. Family-run and client-focused, with deep local knowledge and modernized digital services for a seamless real estate experience.',
    image: '/images/Screenshot 2025-08-02 at 20.44.06.png',
    liveUrl: 'https://bollati-immobilier.mc/',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Material-UI'],
    category: 'real-estate',
    featured: false,
    year: 2023
  },
  {
    id: '11',
    title: 'Woo Restaurant',
    description: 'Modern restaurant website design for Woo Restaurant with elegant UI/UX and online ordering capabilities.',
    image: '/images/woo.png',
    liveUrl: 'https://woo.mc/',
    technologies: ['WordPress', 'WooCommerce', 'Custom Plugins', 'Payment Gateway'],
    category: 'restaurant',
    featured: false,
    year: 2023
  },
  {
    id: '8',
    title: 'Smart Pro',
    description: 'Business consulting firm offering tailored SMART solutions to support project launches, growth acceleration, and revenue scaling for businesses and entrepreneurs.',
    image: '/images/smartpro.png',
    liveUrl: 'https://smartpro.ma/',
    technologies: ['WordPress'],
    category: 'business',
    featured: false,
    year: 2022
  }
];
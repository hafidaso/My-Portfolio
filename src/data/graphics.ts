import { DialogTitle } from "@/components/ui/dialog";

export interface GraphicProject {
  id: string;
  title: string;
  description: string;
  image: string;
  behanceUrl: string;
  category: 'branding' | 'ui-ux' | 'illustration' | 'print' | 'digital-art' | '3d' | 'animation' | 'web-design' | 'social-media' | 'video';
  featured: boolean;
  year: number;
}

export const graphicsData: GraphicProject[] = [
  {
    id: '21',
    title: 'Web Site - Monaco Grand Prix Website',
    description: 'High-speed Formula One themed website design with dynamic elements.',
    image: '/images/ticketgrandprix.png',
    behanceUrl: 'https://www.behance.net/gallery/215246341/Web-Site-Formula-One',
    category: 'web-design',
    featured: false,
    year: 2025
  },
  {
    id: '13',
    title: 'BtobMag – B2B Editorial Design',
    description: 'Creative and professional editorial design for BtobMag, a business-to-business magazine focused on trends, innovation, and entrepreneurship.',
    image: '/images/BTOBMAG FINAL-09.png',
    behanceUrl: 'https://www.behance.net/gallery/231784637/BTOBMag-Made-for-Entrepreneurs-Business-Innovators',
    category: 'print',
    featured: false,
    year: 2024
  },
  {
    id: '1',
    title: 'Business presentation | BTOBSKILLS',
    description: 'Professional business presentation design for BTOBSKILLS showcasing their services and capabilities.',
    image: '/images/btobskilss.png',
    behanceUrl: 'https://www.behance.net/gallery/229734691/Business-presentation-BTOBSKILLS',
    category: 'print',
    featured: false,
    year: 2024
  },
  {
    id: '2',
    title: 'Business presentation | BTOBMACHINES',
    description: 'Comprehensive business presentation design for BTOBMACHINES highlighting their machinery solutions.',
    image: '/images/btobmachines.png',
    behanceUrl: 'https://www.behance.net/gallery/229734403/Business-presentation-BTOBMACHINES',
    category: 'print',
    featured: false,
    year: 2024
  },
  {
    id: '3',
    title: 'Business presentation | BTOBEXCHANGE',
    description: 'Strategic business presentation design for BTOBEXCHANGE platform.',
    image: '/images/btobexchangepresnet.png',
    behanceUrl: 'https://www.behance.net/gallery/229733917/Business-presentation-BTOBEXCHANGE',
    category: 'print',
    featured: false,
    year: 2024
  },
  {
    id: '4',
    title: 'Social Media - Yma Digital',
    description: 'Creative social media content and branding materials for Yma Digital agency.',
    image: '/images/ymadigitalw.webp',
    behanceUrl: 'https://www.behance.net/gallery/217866217/Social-Media-Yma-Digital',
    category: 'social-media',
    featured: true,
    year: 2024
  },
  {
    id: '5',
    title: 'Ennova Group - Promo Video - Milesight',
    description: 'Compelling advertisement video design and motion graphics for various campaigns.',
    image: '/images/Ennova Group - Promo Video - Milesight.png',
    behanceUrl: 'https://www.behance.net/gallery/217367217/Ad-Video',
    category: 'video',
    featured: false,
    year: 2024
  },
  {
    id: '6',
    title: 'Short Videos - BTOBExchange',
    description: 'Engaging short-form video content designed for social media platforms.',
    image: '/images/shortvideo.webp',
    behanceUrl: 'https://www.behance.net/gallery/215334259/Short-Videos-Social-Media',
    category: 'video',
    featured: true,
    year: 2024
  },
  {
    id: '7',
    title: 'BTOBMachines - Promo Video',
    description: 'Promotional video showcasing BTOBMachines products and services.',
    image: '/images/BTOBMachines-Promo Video.webp',
    behanceUrl: 'https://www.behance.net/gallery/215331165/BTOBMachines-Promo-Video',
    category: 'video',
    featured: false,
    year: 2024
  },
  {
    id: '8',
    title: 'Promo Video - BTOBMachine',
    description: 'Another promotional video project for BTOBMachine with different creative approach.',
    image: '/images/Promo Video-BTOBMachine.png',
    behanceUrl: 'https://www.behance.net/gallery/215329947/Promo-Video-BTOBMachine',
    category: 'video',
    featured: false,
    year: 2024
  },
  {
    id: '10',
    title: 'Social Media - IoT',
    description: 'Internet of Things themed social media content and graphics.',
    image: '/images/iot.png',
    behanceUrl: 'https://www.behance.net/gallery/215249041/Social-Media-IoT',
    category: 'social-media',
    featured: false,
    year: 2024
  },
  {
    id: '11',
    title: 'Social Media - BTOBExchange',
    description: 'Social media branding and content for BTOBExchange platform.',
    image: '/images/social-media-btobexchnage.png',
    behanceUrl: 'https://www.behance.net/gallery/215248799/Social-Media-BTOBExchange',
    category: 'social-media',
    featured: false,
    year: 2024
  },
  {
    id: '12',
    title: 'Social Media - VoIP',
    description: 'VoIP technology focused social media graphics and marketing materials.',
    image: '/images/Tech-VoIP.webp',
    behanceUrl: 'https://www.behance.net/gallery/215179627/Social-Media-Tech-VoIP',
    category: 'social-media',
    featured: false,
    year: 2024
  },
  {
    id: '24',
    title: 'Golf Social Media Designs',
    description: 'Golf-themed social media graphics and marketing materials.',
    image: '/images/golf.jpg',
    behanceUrl: 'https://www.behance.net/gallery/215243607/Golf-Social-Media-Designs',
    category: 'social-media',
    featured: false,
    year: 2024
  },
  {
    id: '25',
    title: 'Pool Products - Videos Ad',
    description: 'Video advertisement design for pool products and accessories.',
    image: '/images/poolshoop.webp',
    behanceUrl: 'https://www.behance.net/gallery/12345700/pool-products-videos-ad',
    category: 'video',
    featured: false,
    year: 2024
  },
  {
    id: '27',
    title: 'Social Media - Cocofield - Food Social',
    description: 'Food-themed social media post designs for restaurant marketing.',
    image: '/images/Food-Social.png',
    behanceUrl: 'https://www.behance.net/gallery/215224273/Social-Media-Post-Design-Food-Social',
    category: 'social-media',
    featured: false,
    year: 2024
  },
  {
    id: '28',
    title: 'Real State-Social Media Post Design',
    description: 'Real estate social media post designs and marketing materials.',
    image: '/images/le134.jpg',
    behanceUrl: 'https://www.behance.net/gallery/215223515/Real-State-Social-Media-Post-Design',
    category: 'social-media',
    featured: false,
    year: 2024
  },
  {
    id: '29',
    title: 'Škoda - Social Media',
    description: 'Automotive social media content and graphics for Škoda brand.',
    image: '/images/skioda.webp',
    behanceUrl: 'https://www.behance.net/gallery/215223117/Skoda-Social-Media',
    category: 'social-media',
    featured: false,
    year: 2024
  },
  {
    id: '42',
    title: 'Karuk Package Riz',
    description: 'Product packaging design for Karuk rice brand.',
    image: '/images/karuk-package.png',
    behanceUrl: 'https://www.behance.net/gallery/215188573/karuk-Package-Riz',
    category: 'print',
    featured: false,
    year: 2024
  },
  {
    id: '49',
    title: 'Coffee - Blender',
    description: '3D coffee cup and beverage design created in Blender.',
    image: '/images/coffee-blender.png',
    behanceUrl: 'https://www.behance.net/gallery/215186109/Coffee-Blender',
    category: '3d',
    featured: false,
    year: 2024
  },
  {
    id: '52',
    title: 'Arabic Lamp - Blender',
    description: 'Traditional Arabic lamp 3D design created in Blender.',
    image: '/images/arabic-lamp.png',
    behanceUrl: 'https://www.behance.net/gallery/215178075/Arabic-Lamp-Blender',
    category: '3d',
    featured: false,
    year: 2024
  },
  {
    id: '59',
    title: 'Sand CGI',
    description: 'Computer-generated imagery of sand textures and landscapes.',
    image: '/images/sand-cgi.png',
    behanceUrl: 'https://www.behance.net/gallery/215171841/Sand-CGI',
    category: '3d',
    featured: false,
    year: 2024
  },
  {
    id: '63',
    title: '3D Isometric | Home | Blender',
    description: 'Isometric 3D home design created in Blender with architectural precision.',
    image: '/images/3d-isometric-home.png',
    behanceUrl: 'https://www.behance.net/gallery/215170745/3D-Isometric-Home-Blender',
    category: '3d',
    featured: false,
    year: 2024
  },
  {
    id: '79',
    title: 'Retail - Morocco - AI',
    description: 'AI-generated retail design concepts for Moroccan market.',
    image: '/images/Retail-Morocco-AI.png',
    behanceUrl: 'https://www.behance.net/gallery/214689417/Retail-Morocco-AI',
    category: 'digital-art',
    featured: false,
    year: 2024
  },
  {
    id: '82',
    title: 'Bohemian-Style Living Rooms',
    description: 'Interior design concepts for bohemian-style living rooms.',
    image: '/images/Bohemian-Style.png',
    behanceUrl: 'https://www.behance.net/gallery/214686991/Bohemian-Style-Living-Rooms',
    category: 'digital-art',
    featured: false,
    year: 2024
  },
  {
    id: '84',
    title: 'Morocco AI',
    description: 'AI-generated artwork inspired by Moroccan culture and landscapes.',
    image: '/images/Morocco-AI.png',
    behanceUrl: 'https://www.behance.net/gallery/214681003/Morocco-AI',
    category: 'digital-art',
    featured: false,
    year: 2024
  },
  {
    id: '9',
    title: 'Social Media - Poolshop',
    description: 'Social media graphics and content design for pool shop business.',
    image: '/images/Poolshop-socialmedia.png',
    behanceUrl: 'https://www.behance.net/gallery/215279963/Social-Media-Poolshop',
    category: 'social-media',
    featured: false,
    year: 2023
  },
  {
    id: '26',
    title: 'Adidas Sneakers - Superstar',
    description: 'Creative design work for Adidas Superstar sneakers campaign.',
    image: '/images/Adidas-Sneakers.png',
    behanceUrl: 'https://www.behance.net/gallery/215224481/Adidas-Sneakers-Superstar',
    category: 'branding',
    featured: false,
    year: 2023
  },
  {
    id: '68',
    title: 'The Moon - Blender',
    description: 'Realistic 3D moon design created in Blender with detailed surface textures.',
    image: '/images/moon-blender.png',
    behanceUrl: 'https://www.behance.net/gallery/215168267/The-Moon-Blender',
    category: '3d',
    featured: false,
    year: 2023
  },
  {
    id: '86',
    title: 'Travel Logo',
    description: 'Custom travel industry logo design with modern aesthetics.',
    image: '/images/travel-logo.png',
    behanceUrl: 'https://www.behance.net/gallery/214249171/Travel-Logo',
    category: 'branding',
    featured: false,
    year: 2022
  },
  {
    id: '85',
    title: 'Brand Identity, Brand Guidelines',
    description: 'Comprehensive brand identity design and guidelines for various clients.',
    image: '/images/Brand-Identity.png',
    behanceUrl: 'https://www.behance.net/gallery/214632135/Brand-Identity-Brand-Guidelines',
    category: 'branding',
    featured: false,
    year: 2019
  },
  {
    id: '101',
    title: 'Stand 3D',
    description: '3D exhibition stand design for trade shows and events.',
    image: '/images/stand3D.png',
    behanceUrl: 'https://www.behance.net/gallery/206695741/Stand-3D',
    category: '3d',
    featured: false,
    year: 2019
  },
];
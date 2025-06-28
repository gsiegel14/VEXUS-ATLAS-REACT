export const homeConfig = {
  products: [
    {
      id: 1,
      name: 'POCUS IS LIFE! - Dark Logo',
      price: '$25.00',
      image: '/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-647a91c607f51.jpg',
      url: '/merch/pocus-is-life-dark-logo'
    },
    {
      id: 2,
      name: 'POCUS IS LIFE! - Light Logo', 
      price: '$25.00',
      image: '/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-647a921f84b40.jpg',
      url: '/merch/pocus-is-life-light-logo'
    },
    {
      id: 3,
      name: 'POCUS Atlas T-Shirt (Cream Logo)',
      price: '$25.00',
      image: '/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-614d330957412.jpg',
      url: '/merch/pocus-atlas-t-shirt-cream-logo'
    },
    {
      id: 4,
      name: 'Sonophile T-shirt!',
      price: '$25.00',
      image: '/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-602eb4adeeb2f.jpg',
      url: '/merch/sonophile-t-shirt'
    },
    {
      id: 5,
      name: 'The POCUS Atlas Mug',
      price: '$20.00',
      image: '/images/ceramic-mug-15oz-white-647a93493685c.jpg',
      url: '/merch/the-pocus-atlas-mug'
    }
  ],

  projects: [
    {
      title: 'Image Atlas',
      icon: '/images/noun-atlas-1479193-453E3E.png',
      link: 'https://www.thepocusatlas.com/home',
      description: 'Comprehensive collection of VEXUS ultrasound images'
    },
    {
      title: 'Evidence Atlas', 
      icon: '/images/noun-literature-4460602-453E3E.png',
      link: 'https://www.thepocusatlas.com/ea-home',
      description: 'Research papers and scientific evidence'
    },
    {
      title: 'Nerve Block Atlas',
      icon: '/images/noun-nerve-4666605-453E3E.png', 
      link: 'https://www.thepocusatlas.com/nerve-blocks',
      description: 'Comprehensive nerve block guidance'
    },
    {
      title: 'Image Review',
      icon: '/images/noun-video-review-4806914-453E3E.png',
      link: 'https://www.thepocusatlas.com/image-review',
      description: 'Interactive image review and learning'
    }
  ],

  newsItems: [
    {
      id: 1,
      title: 'POCUS Atlas Jr Project',
      description: 'We are building the first ever free, open-access pediatric POCUS Atlas! This atlas will be available to use for education around the world. We need your help on this project, find out how you can contribute below.',
      image: '/images/The-POCUS-ATLAS-110.jpg',
      link: '/atlas-jr',
      linkText: 'Learn more',
      imagePosition: 'left'
    },
    {
      id: 2,
      title: 'Get the App!',
      description: 'The POCUS Image Atlas is now available in app form! Download on either iOS or Android!',
      image: '/images/noun-apps-914827-453E3E.jpg',
      imagePosition: 'right',
      customActions: true,
      appLinks: {
        ios: 'https://apps.apple.com/us/app/the-pocus-atlas/id1603683100?platform=iphone',
        android: 'https://play.google.com/store/apps/details?id=com.globalpocuspartners.pocusAtlas'
      }
    },
    {
      id: 3,
      title: 'Live Course in San Diego!',
      description: 'Want to come to an awesome POCUS course in San Diego? Check out our NextGen POCUS: Beyond Essentials for Acute Care Course scheduled for November 6th-8th, 2024!',
      image: '/images/IMG_2864_LR-1.jpg',
      link: 'https://www.soundandsurf.com',
      linkText: 'Learn more',
      external: true,
      imagePosition: 'left'
    }
  ],

  structuredData: {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "POCUS IS LIFE! - Dark Logo",
          "image": "/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-647a91c607f51.jpg",
          "url": "/merch/pocus-is-life-dark-logo",
          "offers": {
            "@type": "Offer",
            "price": "25.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "POCUS IS LIFE! - Light Logo",
          "image": "/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-647a921f84b40.jpg",
          "url": "/merch/pocus-is-life-light-logo",
          "offers": {
            "@type": "Offer",
            "price": "25.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Product",
          "name": "POCUS Atlas T-Shirt (Cream Logo)",
          "image": "/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-614d330957412.jpg",
          "url": "/merch/pocus-atlas-t-shirt-cream-logo",
          "offers": {
            "@type": "Offer",
            "price": "25.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Product",
          "name": "Sonophile T-shirt!",
          "image": "/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-602eb4adeeb2f.jpg",
          "url": "/merch/sonophile-t-shirt",
          "offers": {
            "@type": "Offer",
            "price": "25.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      }
    ]
  }
};

export type HomeConfigType = typeof homeConfig; 
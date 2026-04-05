import type { LandingPageConfig } from "./types.js";

const defaultFeatures: LandingPageConfig["features"] = [
  {
    title: "Multi-store management",
    description:
      "Run multiple brands from one dashboard—perfect for agencies and operators scaling a multi vendor ecommerce platform in India.",
    icon: "store",
  },
  {
    title: "Product & catalog tools",
    description:
      "Variants, collections, and rich media so you can launch fast whether you sell sarees, jewelry, or electronics.",
    icon: "box",
  },
  {
    title: "Payments that convert",
    description:
      "Accept cards and UPI with Razorpay and international buyers with Stripe—built for Indian checkout flows.",
    icon: "payment",
  },
  {
    title: "Orders & tracking",
    description:
      "Fulfillment statuses, customer notifications, and shipment tracking keep buyers confident after they pay.",
    icon: "truck",
  },
  {
    title: "Inventory you can trust",
    description:
      "Low-stock alerts, multi-location support, and accurate counts reduce overselling and support tickets.",
    icon: "inventory",
  },
];

const defaultTestimonials: LandingPageConfig["testimonials"] = [
  {
    quote:
      "We replaced a bloated stack with this platform and still hit sub-two-second loads—our conversion rate jumped within weeks.",
    name: "Ananya Mehta",
    role: "Founder, D2C apparel",
    rating: 5,
  },
  {
    quote:
      "Razorpay plus clean storefront themes meant we could create our ecommerce website without hiring a frontend team.",
    name: "Rahul K.",
    role: "Operations lead, lifestyle brand",
    rating: 5,
  },
  {
    quote:
      "Multi-store controls are exactly what we needed for our jewelry lines—one login, separate catalogs and payouts.",
    name: "S. Iyer",
    role: "Ecommerce director",
    rating: 5,
  },
];

const defaultPartnerLogos: NonNullable<LandingPageConfig["partnerLogos"]> = [
  { name: "Northwind Retail", alt: "Northwind Retail logo placeholder" },
  { name: "BlueRiver Goods", alt: "BlueRiver Goods logo placeholder" },
  { name: "Kite & Co.", alt: "Kite and Co logo placeholder" },
  { name: "Monsoon Market", alt: "Monsoon Market logo placeholder" },
];

const defaultPricing: LandingPageConfig["pricingPlans"] = [
  {
    name: "Starter",
    priceMonthly: "₹999",
    description: "Launch your first storefront with core commerce features.",
    features: [
      "1 store",
      "Unlimited products",
      "Razorpay & Stripe",
      "Email support",
    ],
    cta: { label: "Start free trial", href: "/signup?plan=starter" },
  },
  {
    name: "Growth",
    priceMonthly: "₹2,499",
    description: "Scale with automation, staff accounts, and priority help.",
    features: [
      "Up to 5 stores",
      "Advanced inventory",
      "Order automation",
      "Chat support",
    ],
    highlighted: true,
    cta: { label: "Start free trial", href: "/signup?plan=growth" },
  },
  {
    name: "Scale",
    priceMonthly: "Custom",
    description: "For high-volume brands and multi-vendor marketplaces.",
    features: [
      "Unlimited stores",
      "Dedicated success",
      "SLA & SSO options",
      "Custom integrations",
    ],
    cta: { label: "Talk to sales", href: "/contact?plan=scale" },
  },
];

const defaultFaq: LandingPageConfig["faq"] = [
  {
    question: "How to create ecommerce website without coding?",
    answer:
      "Pick a template, connect your domain, add products, and go live. Our MERN-powered builder handles hosting, checkout, and payments so you focus on merchandising and growth.",
  },
  {
    question: "Is this a better Shopify alternative for India?",
    answer:
      "If you need Razorpay-first checkout, INR pricing, and multi-store operations tuned for Indian sellers, our platform is built for you—without surprise app fees for core commerce.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes. Connect a domain you already own or purchase through your registrar—we provision SSL and keep your brand on every page.",
  },
  {
    question: "Do you support Indian payments?",
    answer:
      "Absolutely. Razorpay is supported out of the box for UPI, cards, and netbanking, with Stripe available for global customers.",
  },
  {
    question: "Can I run a multi vendor ecommerce platform in India?",
    answer:
      "Growth and Scale plans include vendor onboarding, payouts, and catalog separation so marketplaces can operate compliantly at scale.",
  },
];

function baseUseCases(): LandingPageConfig["useCases"] {
  return [
    {
      id: "saree",
      heading: "Online store for saree business",
      description:
        "Showcase drapes with lookbooks, variant swatches, and occasion-based collections engineered for high-AVT purchases.",
      cta: { label: "Explore saree storefronts", href: "/saree-ecommerce-website" },
      image: {
        src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        alt: "Saree ecommerce website builder — elegant fabric display for online saree business",
      },
    },
    {
      id: "jewelry",
      heading: "Jewelry ecommerce website builder",
      description:
        "Zoom-friendly galleries, metal and stone variants, and trust signals that help shoppers commit on fine jewelry.",
      cta: { label: "See jewelry templates", href: "/jewelry-store-builder" },
      image: {
        src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        alt: "Jewelry ecommerce website builder with product detail and gemstones",
      },
    },
    {
      id: "clothing",
      heading: "Clothing brand storefronts",
      description:
        "Size guides, collection drops, and fast mobile checkout tuned for fashion buyers who browse on the go.",
      cta: { label: "Start clothing store", href: "/start-online-store" },
      image: {
        src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        alt: "Clothing brand online store — retail racks and modern boutique aesthetic",
      },
    },
    {
      id: "toys",
      heading: "Toy store ecommerce",
      description:
        "Age filters, safety badges, and bundle-friendly carts that make it easy for parents to buy with confidence.",
      cta: { label: "Launch toy store", href: "/create-ecommerce-website" },
      image: {
        src: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80",
        alt: "Toy store ecommerce website with colorful products for kids",
      },
    },
  ];
}

export const landingConfigs: Record<string, LandingPageConfig> = {
  "/create-ecommerce-website": {
    id: "create-ecommerce-website",
    niche: "general",
    path: "/create-ecommerce-website",
    meta: {
      title:
        "Create Ecommerce Website in Minutes | Multi-Store SaaS for India",
      description:
        "Create ecommerce website with Razorpay-ready checkout, inventory, and multi-store control. A fast Shopify alternative India teams use to start online store growth without code.",
      canonicalPath: "/create-ecommerce-website",
      keywords:
        "create ecommerce website, start online store, cheap ecommerce platform india, multi vendor ecommerce platform india",
      ogImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    },
    abTest: { headline: true, ctaLabel: true },
    hero: {
      headline: "Build your ecommerce store in minutes—no coding needed",
      headlineVariantB: "Create ecommerce website that loads fast and converts",
      subheadline:
        "Spin up multiple storefronts, sync inventory, and launch with Razorpay or Stripe. The flexible way to start online store operations built on a modern MERN stack.",
      primaryCta: { label: "Start free trial", href: "/signup?trial=1" },
      secondaryCta: { label: "View demo", href: "/demo" },
      heroImage: {
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
        alt: "Merchant laptop showing create ecommerce website dashboard and analytics",
      },
    },
    trustBadges: [
      { label: "SOC2-ready practices" },
      { label: "99.9% uptime SLA on Scale" },
      { label: "GDPR-friendly tooling" },
    ],
    testimonials: defaultTestimonials,
    partnerLogos: defaultPartnerLogos,
    features: defaultFeatures,
    useCases: baseUseCases(),
    pricingPlans: defaultPricing,
    faq: defaultFaq,
    finalCta: {
      headline: "Start your store today",
      subline:
        "Join founders who chose a cheap ecommerce platform India sellers can actually scale on—without sacrificing polish.",
      primaryCta: { label: "Start free trial", href: "/signup?trial=1" },
    },
  },

  "/shopify-alternative-india": {
    id: "shopify-alternative-india",
    niche: "shopify-alt",
    path: "/shopify-alternative-india",
    meta: {
      title: "Shopify Alternative India | Razorpay-First Ecommerce Platform",
      description:
        "The Shopify alternative India brands trust for UPI, multi-store ops, and transparent SaaS pricing. Build ecommerce website MERN teams can extend—without surprise app taxes.",
      canonicalPath: "/shopify-alternative-india",
      keywords:
        "shopify alternative india, cheap ecommerce platform india, multi vendor ecommerce platform india",
      ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    },
    hero: {
      headline: "The Shopify alternative India operators actually control",
      subheadline:
        "Razorpay-native checkout, INR-first pricing, and multi-store dashboards—purpose-built when you need more than a generic global default.",
      primaryCta: { label: "Start free trial", href: "/signup?source=shopify-alt" },
      secondaryCta: { label: "View demo", href: "/demo" },
      heroImage: {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
        alt: "Shopify alternative India — analytics dashboard for Indian ecommerce brands",
      },
    },
    trustBadges: [
      { label: "Razorpay partner-ready" },
      { label: "MERN extensibility" },
      { label: "Human support in IST hours" },
    ],
    testimonials: defaultTestimonials,
    partnerLogos: defaultPartnerLogos,
    features: defaultFeatures,
    useCases: baseUseCases(),
    pricingPlans: defaultPricing,
    faq: defaultFaq,
    finalCta: {
      headline: "Migrate without drama",
      subline:
        "Keep your catalog, dial in Indian payments, and launch faster than replatforming projects that drag for quarters.",
      primaryCta: { label: "Start free trial", href: "/signup?source=shopify-alt" },
    },
  },

  "/start-online-store": {
    id: "start-online-store",
    niche: "general",
    path: "/start-online-store",
    meta: {
      title: "Start Online Store | Fast Launch, Indian Payments, Multi-Store",
      description:
        "Start online store with guided setup, Razorpay checkout, and inventory that stays accurate. Create ecommerce website experiences shoppers trust on mobile.",
      canonicalPath: "/start-online-store",
      keywords: "start online store, create ecommerce website, cheap ecommerce platform india",
      ogImage: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&q=80",
    },
    hero: {
      headline: "Start online store tonight—ship sales tomorrow",
      subheadline:
        "Templates, product imports, and payment onboarding are streamlined so you can go live while momentum is hot.",
      primaryCta: { label: "Start free trial", href: "/signup?source=start" },
      secondaryCta: { label: "View demo", href: "/demo" },
      heroImage: {
        src: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&q=80",
        alt: "Entrepreneur starting online store on laptop ecommerce platform",
      },
    },
    testimonials: defaultTestimonials,
    partnerLogos: defaultPartnerLogos,
    features: defaultFeatures,
    useCases: baseUseCases(),
    pricingPlans: defaultPricing,
    faq: defaultFaq,
    finalCta: {
      headline: "Start your store today",
      subline: "Your catalog deserves a storefront that feels as premium as your products.",
      primaryCta: { label: "Start free trial", href: "/signup?source=start" },
    },
  },

  "/build-ecommerce-website-mern": {
    id: "build-ecommerce-website-mern",
    niche: "mern",
    path: "/build-ecommerce-website-mern",
    meta: {
      title: "Build Ecommerce Website MERN | APIs, Themes, Hosted Checkout",
      description:
        "Build ecommerce website MERN teams can customize: composable APIs, React storefront SDK, and managed infrastructure so engineers focus on differentiation.",
      canonicalPath: "/build-ecommerce-website-mern",
      keywords: "build ecommerce website MERN, create ecommerce website, shopify alternative india",
      ogImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    },
    hero: {
      headline: "Build ecommerce website on MERN—without reinventing commerce",
      subheadline:
        "Headless-ready APIs, typed SDKs, and operational dashboards mean your squad ships features instead of payment edge cases.",
      primaryCta: { label: "Start free trial", href: "/signup?source=mern" },
      secondaryCta: { label: "View demo", href: "/demo" },
      heroImage: {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
        alt: "Developer building ecommerce website MERN stack with code editor",
      },
    },
    testimonials: defaultTestimonials,
    partnerLogos: defaultPartnerLogos,
    features: defaultFeatures,
    useCases: baseUseCases(),
    pricingPlans: defaultPricing,
    faq: defaultFaq,
    finalCta: {
      headline: "Ship the storefront your roadmap promised",
      subline:
        "Pair merchant-grade admin tools with the flexibility only a modern JavaScript stack can deliver.",
      primaryCta: { label: "Start free trial", href: "/signup?source=mern" },
    },
  },

  "/saree-ecommerce-website": {
    id: "saree-ecommerce-website",
    niche: "saree",
    path: "/saree-ecommerce-website",
    meta: {
      title: "Online Store for Saree Business | Lookbooks, Variants, UPI Checkout",
      description:
        "Launch an online store for saree business with fabric storytelling, variant swatches, and Razorpay UPI. Niche-optimized templates inside our multi-tenant ecommerce SaaS.",
      canonicalPath: "/saree-ecommerce-website",
      keywords:
        "online store for saree business, create ecommerce website, cheap ecommerce platform india",
      ogImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
    },
    hero: {
      headline: "Online store for saree business—designed for drape buyers",
      subheadline:
        "Highlight craftsmanship, manage blouse add-ons, and convert mobile shoppers with fast, India-ready checkout.",
      primaryCta: { label: "Start free trial", href: "/signup?niche=saree" },
      secondaryCta: { label: "View demo", href: "/demo?niche=saree" },
      heroImage: {
        src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
        alt: "Online store for saree business — premium saree ecommerce product photography",
      },
    },
    testimonials: defaultTestimonials,
    partnerLogos: defaultPartnerLogos,
    features: defaultFeatures,
    useCases: baseUseCases(),
    pricingPlans: defaultPricing,
    faq: [
      ...defaultFaq,
      {
        question: "Can I show fabric details and care instructions?",
        answer:
          "Yes—use rich product pages with tabs for fabric, care, and shipping timelines so customers understand exactly what they are buying.",
      },
    ],
    finalCta: {
      headline: "Drape your catalog in a storefront that sells",
      subline:
        "Purpose-built flows for occasion shopping, gift notes, and high-trust payments.",
      primaryCta: { label: "Start free trial", href: "/signup?niche=saree" },
    },
  },

  "/jewelry-store-builder": {
    id: "jewelry-store-builder",
    niche: "jewelry",
    path: "/jewelry-store-builder",
    meta: {
      title: "Jewelry Ecommerce Website Builder | Zoom Galleries & Secure Checkout",
      description:
        "Jewelry ecommerce website builder with certificate fields, metal purity variants, and Stripe or Razorpay. Start online store experiences worthy of fine pieces.",
      canonicalPath: "/jewelry-store-builder",
      keywords:
        "jewelry ecommerce website builder, create ecommerce website, shopify alternative india",
      ogImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
    },
    hero: {
      headline: "Jewelry ecommerce website builder buyers trust",
      subheadline:
        "High-resolution galleries, engraving options, and fulfillment workflows tuned for high-consideration purchases.",
      primaryCta: { label: "Start free trial", href: "/signup?niche=jewelry" },
      secondaryCta: { label: "View demo", href: "/demo?niche=jewelry" },
      heroImage: {
        src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
        alt: "Jewelry ecommerce website builder showcasing rings and gemstones online",
      },
    },
    testimonials: defaultTestimonials,
    partnerLogos: defaultPartnerLogos,
    features: defaultFeatures,
    useCases: baseUseCases(),
    pricingPlans: defaultPricing,
    faq: defaultFaq,
    finalCta: {
      headline: "Show every facet of your brand online",
      subline:
        "From bespoke pieces to fast-moving collections, keep inventory and storytelling in sync.",
      primaryCta: { label: "Start free trial", href: "/signup?niche=jewelry" },
    },
  },
};

export const marketingPaths = Object.keys(landingConfigs);

export function getLandingConfig(pathname: string): LandingPageConfig | null {
  return landingConfigs[pathname] ?? null;
}

import type { FAQItem } from "@/lib/types";

export const faqs: FAQItem[] = [
  // General
  {
    question: "What is NammaOffice?",
    answer:
      "NammaOffice is a premium coworking and managed office space provider with 10 centres across Salem, Trichy, Tirupur, Erode, and Hosur in Tamil Nadu. We offer a range of workspace solutions including private cabins, open desks, cubicles, meeting halls, business lounges, and fully managed offices.",
    category: "general",
  },
  {
    question: "What are your operating hours?",
    answer:
      "All NammaOffice centres are open Monday to Saturday from 8:00 AM to 9:00 PM. Members with 24/7 access plans can access their private cabins or managed offices round the clock using biometric entry.",
    category: "general",
  },
  {
    question: "Do I need to sign a long-term contract?",
    answer:
      "Not at all. We offer flexible plans starting from daily passes for open desks to monthly and annual plans for private cabins. Our managed office leases start from 1 year with flexible renewal options. You choose what suits your business.",
    category: "general",
  },
  {
    question: "What amenities are included in my membership?",
    answer:
      "All memberships include access to high-speed Wi-Fi, power backup, air conditioning, pantry with tea and coffee, printing and scanning, parking, and security. Higher-tier plans include additional benefits like personal lockers, meeting room credits, and reception services.",
    category: "general",
  },
  // Pricing
  {
    question: "How much does a private cabin cost?",
    answer:
      "Private cabin pricing depends on the location, cabin size, and lease duration. We offer competitive monthly and annual rates. Contact us at +91 9092109213 or WhatsApp us for a personalised quote based on your team size and preferred location.",
    category: "pricing",
  },
  {
    question: "Do you offer day passes for the open desk?",
    answer:
      "Yes! We offer flexible day passes, weekly passes, and monthly memberships for our open desk coworking areas. Day passes are great for trying out the space before committing to a longer plan.",
    category: "pricing",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No. All our plans are all-inclusive and transparently priced. Your monthly fee covers workspace access, Wi-Fi, power, AC, and the amenities included in your plan. Any add-ons (extra meeting room hours, printing beyond limits) are clearly communicated upfront.",
    category: "pricing",
  },
  {
    question: "Do you offer GST invoices?",
    answer:
      "Yes. NammaOffice provides proper GST invoices for all workspace plans. We can also assist members with GST registration at our business address.",
    category: "pricing",
  },
  // Locations
  {
    question: "How many NammaOffice centres are there?",
    answer:
      "We have 10 centres across 5 cities — 6 in Salem (Anushka Tower / Fairlands, Balaji Tower / Ramakrishna Road, Rajeshwari Towers, New Bus Stand / Meyyanur, TIDEL NEO / Karuppur, and IPOD / Reliance Mega Mall), 1 in Trichy (TIDEL NEO), 1 in Tirupur (TIDEL NEO / Thirumuruganpoondi), 1 in Erode (Texvalley, NH-544), and 1 in Hosur (Sipcot Phase II).",
    category: "locations",
  },
  {
    question: "Can I use multiple NammaOffice locations with one membership?",
    answer:
      "Yes. Our multi-location plans allow you to access coworking facilities across our centres. Ask our team about our All-City Pass that gives you open desk access at any NammaOffice location across Salem, Trichy, Tirupur, Erode, and Hosur.",
    category: "locations",
  },
  {
    question: "Is parking available at all centres?",
    answer:
      "Yes, free parking for cars and two-wheelers is available at all our centres. Some premium centres also offer reserved parking spots for private cabin and managed office members.",
    category: "locations",
  },
  // Services
  {
    question: "Can I use a NammaOffice address as my business/GST address?",
    answer:
      "Yes. Private cabin and cubicle members can use their NammaOffice centre's address as a registered business address and for GST registration. We provide the necessary NOC and address proof documentation.",
    category: "services",
  },
  {
    question: "Do you provide virtual office services?",
    answer:
      "Yes, we offer virtual office plans that include a prestigious business address, mail handling, and phone answering services. Ideal for businesses that need a professional presence in Salem, Trichy, or Tirupur without a physical workspace.",
    category: "services",
  },
  {
    question: "Can I book a meeting room without being a member?",
    answer:
      "Absolutely. Our meeting halls and conference rooms are available for non-members on an hourly or daily booking basis. Contact us to check availability and pricing.",
    category: "services",
  },
  // Franchise
  {
    question: "Does NammaOffice offer franchise opportunities?",
    answer:
      "Yes! We offer a comprehensive franchise programme for entrepreneurs who want to own and operate a NammaOffice centre. Our franchise model comes with proven systems, brand support, and operational guidance. Centres range from 2,000 to 20,000 sq ft with a long-term agreement. Detailed unit economics and projected returns are shared confidentially during your discovery call.",
    category: "franchise",
  },
  {
    question: "What support do franchise partners receive?",
    answer:
      "NammaOffice franchise partners receive end-to-end support including site selection guidance, interior design and fitout, IT and technology setup, sales and marketing support, staff training, and ongoing operational support. You're in business for yourself, but not by yourself.",
    category: "franchise",
  },
  {
    question: "How do I apply for a NammaOffice franchise?",
    answer:
      "You can apply by filling out the franchise enquiry form on our website or by calling us at +91 9092109213. Our franchise development team will reach out within 48 hours to discuss your proposal.",
    category: "franchise",
  },
];

export function getFaqsByCategory(
  category: FAQItem["category"]
): FAQItem[] {
  return faqs.filter((f) => f.category === category);
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/**" },
    ],
  },
  trailingSlash: false,
  async redirects() {
    return [
      // Old service-prefixed forms moved under /registration
      { source: "/services/company-registration", destination: "/registration/company", permanent: true },

      // Old book-tour collapsed into the unified bookings flow
      { source: "/book-tour", destination: "/bookings", permanent: true },

      // Anchor-only sections — direct URL hits should land on the anchor.
      { source: "/amenities", destination: "/#amenities", permanent: false },
      { source: "/about-us", destination: "/#about", permanent: false },

      // Old marketing pages removed in the strict-parity revamp.
      // Redirect to the closest equivalent rather than 404 to preserve any
      // external SEO juice or live links the client may have shared.
      { source: "/services/virtual-office", destination: "/registration/company", permanent: true },
      { source: "/services", destination: "/registration/company", permanent: true },
      { source: "/workation", destination: "/locations", permanent: true },
      { source: "/workspaces", destination: "/locations", permanent: true },
      { source: "/workspaces/:slug", destination: "/locations", permanent: true },
      { source: "/pricing", destination: "/bookings", permanent: true },
      { source: "/gallery", destination: "/locations", permanent: true },
      { source: "/faq", destination: "/franchise", permanent: true },

      // Old centre slug renamed to match reference site label
      { source: "/locations/salem/brindavan-road", destination: "/locations/salem/fairlands", permanent: true },

      // ---- Old Wix URL → new route map (TC-064) -----------------------
      // Centres
      { source: "/newbustandsalem", destination: "/locations/salem/new-bus-stand", permanent: true },
      { source: "/salembalajitowers", destination: "/locations/salem/balaji-tower", permanent: true },
      { source: "/salemrajeshwaritowers", destination: "/locations/salem/rajeshwari-towers", permanent: true },
      { source: "/trichyashagrand-servicerequestform", destination: "/locations/trichy/asha-grand", permanent: true },

      // Forms — Wix flat URLs → /registration/* + /bookings
      { source: "/company-registration", destination: "/registration/company", permanent: true },
      { source: "/user-registration-form", destination: "/registration/user", permanent: true },
      { source: "/vendor-form", destination: "/registration/vendor", permanent: true },
      { source: "/bookings-form", destination: "/bookings", permanent: true },
      { source: "/registration-forms", destination: "/forms", permanent: true },
      { source: "/walkinenquiryform", destination: "/contact", permanent: true },

      // Service request forms — these were per-centre on Wix; route to bookings.
      { source: "/salemtidelneo-servicerequestform", destination: "/bookings", permanent: true },
      { source: "/salembalajitowers-servicerequestform", destination: "/bookings", permanent: true },
      { source: "/salembrinthavanroad-servicerequestform", destination: "/bookings", permanent: true },
      { source: "/salemrajeshwaritowers-servicerequestform", destination: "/bookings", permanent: true },
      { source: "/tiruppurtidelneo-servicerequestform", destination: "/bookings", permanent: true },
      { source: "/hosur-servicerequestform", destination: "/bookings", permanent: true },

      // Meeting / discussion / boardroom pages — collapse into bookings.
      { source: "/meeting-room", destination: "/bookings", permanent: true },
      { source: "/copy-of-meeting-space", destination: "/bookings", permanent: true },
      { source: "/salemtidelneoboardroom", destination: "/bookings", permanent: true },
      { source: "/salemtidelneodiscussionroom", destination: "/bookings", permanent: true },
      { source: "/tiruppurtidelneoboardroom", destination: "/bookings", permanent: true },
      { source: "/tiruppurtidelneodiscussionroom", destination: "/bookings", permanent: true },

      // Gate pass — Wix had per-park; new site has the dedicated routes.
      { source: "/gatepass-tidelneosalem", destination: "/gate-pass/tidel-neo-salem", permanent: true },
      { source: "/gatepass-tidelneotiruppur", destination: "/gate-pass/tidel-neo-tirupur", permanent: true },

      // Misc marketing pages
      { source: "/plans-pricing", destination: "/bookings", permanent: true },
      { source: "/private-office", destination: "/locations", permanent: true },
      { source: "/open-space", destination: "/locations", permanent: true },
      { source: "/book-online", destination: "/bookings", permanent: true },

      // Removed content (news/events/blog) — funnel to home rather than 404.
      { source: "/newsinsights", destination: "/", permanent: false },
      { source: "/event-list", destination: "/", permanent: false },
      { source: "/events", destination: "/", permanent: false },
      { source: "/challenges", destination: "/", permanent: false },

      // Internal/portal pages on the old site — funnel to contact so a
      // legacy bookmark still reaches a human.
      { source: "/support-page", destination: "/contact", permanent: false },
      { source: "/my-service-request", destination: "/contact", permanent: false },
      { source: "/management-portal", destination: "/contact", permanent: false },
      { source: "/nammaoffice-feedback", destination: "/contact", permanent: false },
      { source: "/eyal-leadmanagement", destination: "/contact", permanent: false },
      { source: "/nammaoffice-visitor-declarationform", destination: "/contact", permanent: false },
      { source: "/employee-declarationform", destination: "/contact", permanent: false },
      { source: "/employeedeclarationform", destination: "/contact", permanent: false },
      { source: "/nondisclosureaggrementform", destination: "/contact", permanent: false },
      { source: "/userexperiencenondisclosureform", destination: "/contact", permanent: false },
      { source: "/oath-page", destination: "/contact", permanent: false },
      { source: "/thank-u-page", destination: "/", permanent: false },
      { source: "/ipod-usage-booking", destination: "/bookings", permanent: true },
      { source: "/tidel-neo-salem-aggrement-form", destination: "/locations/salem/tidel-neo", permanent: false },
    ];
  },
};

export default nextConfig;

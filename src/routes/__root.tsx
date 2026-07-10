import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
    const gtmId = import.meta.env.VITE_GTM_CONTAINER_ID as string | undefined;

    const scripts: Array<Record<string, unknown>> = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
              "@id": "https://hilluxetech.lovable.app/#organization",
              name: "Hilluxe Tech",
              url: "https://hilluxetech.lovable.app/",
              description:
                "Hilluxe Tech is a professional website design and development agency specializing in Shopify, WordPress, e-commerce, SEO, UI/UX, AI automation, and digital marketing that drives measurable revenue.",
              slogan: "Websites engineered to grow your business.",
              foundingDate: "2020",
              image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e977d751-0a00-4576-b36e-2148f7953604",
              logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e977d751-0a00-4576-b36e-2148f7953604",
              priceRange: "$$",
              areaServed: "Worldwide",
              knowsAbout: [
                "Website design",
                "Website development",
                "Shopify",
                "Shopify Plus",
                "WordPress",
                "E-commerce",
                "Landing page design",
                "Conversion rate optimization",
                "Search engine optimization",
                "Klaviyo email marketing",
                "Meta Ads",
                "Google Ads",
                "TikTok Ads",
                "UI/UX design",
                "AI automation",
                "Branding",
                "Website maintenance",
              ],
              makesOffer: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Design & Development" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shopify Store Design & CRO" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO & Google Ranking" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Klaviyo Email Automation" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Performance Advertising" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Automation & Chat Assistants" } },
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              sameAs: [
                "https://www.facebook.com/profile.php?id=61583751440599",
                "https://www.instagram.com/hilluxetech",
                "https://wa.link/n0x44i",
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  url: "https://wa.link/n0x44i",
                  availableLanguage: ["English"],
                  areaServed: "Worldwide",
                },
                {
                  "@type": "ContactPoint",
                  contactType: "sales",
                  url: "https://wa.link/n0x44i",
                  availableLanguage: ["English"],
                  areaServed: "Worldwide",
                },
              ],
            },
            {
              "@type": "Person",
              "@id": "https://hilluxetech.lovable.app/#founder",
              name: "Hilluxe Tech",
              url: "https://hilluxetech.lovable.app/",
              image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e977d751-0a00-4576-b36e-2148f7953604",
              jobTitle: "Website Designer, Developer & Shopify Growth Partner",
              worksFor: { "@id": "https://hilluxetech.lovable.app/#organization" },
              knowsAbout: [
                "Website design",
                "Shopify",
                "WordPress",
                "SEO",
                "Klaviyo",
                "Meta Ads",
                "Google Ads",
                "UI/UX",
                "AI automation",
              ],
              sameAs: [
                "https://www.facebook.com/profile.php?id=61583751440599",
                "https://www.instagram.com/hilluxetech",
              ],
            },
            {
              "@type": "WebSite",
              "@id": "https://hilluxetech.lovable.app/#website",
              url: "https://hilluxetech.lovable.app/",
              name: "Hilluxe Tech",
              publisher: { "@id": "https://hilluxetech.lovable.app/#organization" },
              inLanguage: "en",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://hilluxetech.lovable.app/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "WebPage",
              "@id": "https://hilluxetech.lovable.app/#webpage",
              url: "https://hilluxetech.lovable.app/",
              name: "Hilluxe Tech — Website Design, Development & Shopify Growth",
              isPartOf: { "@id": "https://hilluxetech.lovable.app/#website" },
              about: { "@id": "https://hilluxetech.lovable.app/#organization" },
              primaryImageOfPage: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e977d751-0a00-4576-b36e-2148f7953604",
              inLanguage: "en",
            },
            {
              "@type": "Service",
              name: "Website Design, Development & Shopify Growth",
              provider: { "@id": "https://hilluxetech.lovable.app/#organization" },
              areaServed: "Worldwide",
              serviceType: "Website design, development, Shopify, SEO, CRO, performance ads, and email automation",
              url: "https://hilluxetech.lovable.app/",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://hilluxetech.lovable.app/" },
              ],
            },

          ],
        }),
      },
    ];

    if (gtmId) {
      scripts.push({
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
      });
    }
    if (gaId) {
      scripts.push({ src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true });
      scripts.push({
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`,
      });
    }

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "google-site-verification", content: "W_c1TpJigfsGeYVW2s5kkf6_q7w4cCyJO-htPhEimyo" },
        { title: "Hilluxe Tech — Shopify Growth Partner & Web Design Agency" },
        { name: "description", content: "Premium Shopify growth partner. Triple your revenue in 60 days with high-converting funnels, performance ads, Klaviyo email automation, and expert web design." },
        { name: "keywords", content: "Shopify agency, Shopify growth, web design, CRO, Klaviyo email marketing, performance ads, ecommerce SEO, landing page design" },
        { name: "author", content: "Hilluxe Tech" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
        { name: "theme-color", content: "#0a0a0a" },
        { property: "og:site_name", content: "Hilluxe Tech" },
        { property: "og:locale", content: "en_US" },
        { property: "og:title", content: "Hilluxe Tech — Shopify Growth Partner & Web Design Agency" },
        { property: "og:description", content: "Triple your Shopify revenue in 60 days with high-converting funnels, performance ads, and Klaviyo email automation." },
        { property: "og:url", content: "https://hilluxetech.lovable.app/" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Hilluxe Tech — Shopify Growth Partner" },
        { name: "twitter:description", content: "Triple your Shopify revenue in 60 days with high-converting funnels, performance ads, and Klaviyo email automation." },
        { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e977d751-0a00-4576-b36e-2148f7953604" },
        { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e977d751-0a00-4576-b36e-2148f7953604" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "canonical", href: "https://hilluxetech.lovable.app/" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" },
      ],
      scripts,
    };
  },

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const gtmId = import.meta.env.VITE_GTM_CONTAINER_ID as string | undefined;
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

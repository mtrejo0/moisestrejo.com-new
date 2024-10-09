import About from "./components/About.js"
import { DefaultSeo } from "next-seo";

export default function Home() {
  return (
    <>
      <DefaultSeo
        title="Moises Trejo - Personal Website"
        description="Welcome to the personal website of Moises Trejo, featuring blog posts, projects, and more."
        canonical="https://www.moisestrejo.com/"
        openGraph={{
          url: 'https://www.moisestrejo.com/',
          title: 'Moises Trejo - Official Site',
          description: 'Personal blog and portfolio of Moises Trejo.',
          images: [
            {
              url: 'https://www.moisestrejo.com/images/front.png',
              width: 800,
              height: 600,
              alt: 'Moises Trejo Portfolio',
            },
          ],
          site_name: 'Moises Trejo',
        }}
        twitter={{
          handle: '@MTrejo0',
          site: '@MTrejo0',
          cardType: 'summary_large_image',
        }}
      />
      <About />
    </>
  )
}

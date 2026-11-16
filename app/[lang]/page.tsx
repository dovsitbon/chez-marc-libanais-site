import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { homeJsonLd } from "@/lib/jsonld";
import { pagePath } from "@/lib/pages";
import { Blocks, CarteNote, Catering, Faq, Formulas, Gift, Heading, Hero, Infos, Reviews, Services, Story, Tiles } from "@/components/Sections";
import { MenuTabs } from "@/components/MenuTabs";

export const revalidate = 3600;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />
      <Hero lang={lang} d={d} />
      <Tiles lang={lang} d={d} />
      <Services lang={lang} d={d} />
      <section id="carte" aria-labelledby="carte-title" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Heading eyebrow={d.carte.eyebrow} title={d.carte.title} id="carte-title">
          <p className="lead mt-4 max-w-2xl">{d.carte.intro}</p>
        </Heading>
        <div className="mt-10">
          <Formulas lang={lang} d={d} />
        </div>
        <div className="mt-12">
          <MenuTabs limit={6} />
        </div>
        <CarteNote lang={lang} d={d} />
        <Link href={pagePath("carte", lang)} className="btn mt-8">
          {d.carte.seeAll}
        </Link>
      </section>
      <Blocks lang={lang} d={d} />
      <Story lang={lang} d={d} />
      <Catering lang={lang} d={d} withPhoto={false} />
      <Reviews lang={lang} d={d} />
      <Infos lang={lang} d={d} />
      <Faq lang={lang} d={d} />
      <Gift lang={lang} d={d} />
    </>
  );
}

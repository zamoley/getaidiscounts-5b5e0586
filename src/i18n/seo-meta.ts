import en from "./locales/en.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import uk from "./locales/uk.json";
import pt from "./locales/pt.json";

type SeoBlock = {
  home_title: string;
  home_description: string;
  home_og_title: string;
  home_og_description: string;
  category_title_suffix: string;
};

const ALL: Record<string, { seo?: SeoBlock }> = {
  en, zh, ja, es, de, fr, it, uk, pt,
};

export function getSeo(locale: string): SeoBlock {
  return (ALL[locale]?.seo ?? (ALL.en.seo as SeoBlock));
}

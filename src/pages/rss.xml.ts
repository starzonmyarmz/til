import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = (await getCollection("articles")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: "TIL — Claude explains",
    description:
      "Things Claude changed that I didn’t understand — explained… by Claude.",
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: `/${article.id}/`,
      categories: article.data.tags,
    })),
  });
}

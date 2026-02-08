import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "tr", profile: "blog" });
console.log(
  analyzer.analyzeSync({
    url: "https://ornek.com/blog/seo",
    title: "Blog SEO iyilestirme",
    content: "<h1>Blog SEO</h1><p>uzun icerik</p>"
  }).suggestions
);


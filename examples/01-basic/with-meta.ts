import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
console.log(
  analyzer.analyzeSync({
    url: "https://example.com/post",
    title: "Post title",
    content: "<h1>Post</h1><p>text text text text</p>",
    meta: {
      description: "SEO description for post",
      canonical: "https://example.com/post"
    }
  })
);


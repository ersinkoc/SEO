import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "ecommerce" });
console.log(
  analyzer.analyzeSync({
    url: "https://shop.example.com/product/x",
    title: "Product X",
    content: "<h1>Product X</h1><p>description</p>",
    structuredData: [{ "@type": "Product" }]
  }).score
);


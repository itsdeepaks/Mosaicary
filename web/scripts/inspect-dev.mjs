async function inspectDevServer() {
  try {
    const res = await fetch("http://localhost:3000/");
    const html = await res.text();
    console.log("=== DEV SERVER SSR HTML INSPECTION ===");
    console.log("HTML length:", html.length);

    const imgMatches = [
      ...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/g),
    ];
    console.log(`\nFound ${imgMatches.length} <img> tags in SSR HTML:`);
    for (const match of imgMatches.slice(0, 10)) {
      console.log(" - SRC:", match[1]);
    }

    const cardMatches = [
      ...html.matchAll(
        /data-resource-name=["']([^"']+)["'][^>]*data-media-state=["']([^"']+)["']/g,
      ),
    ];
    console.log(`\nResource card states (first 10):`);
    for (const match of cardMatches.slice(0, 10)) {
      console.log(` - Resource: "${match[1]}", media-state: "${match[2]}"`);
    }
  } catch (err) {
    console.error("Failed to connect to dev server:", err.message);
  }
}

inspectDevServer();

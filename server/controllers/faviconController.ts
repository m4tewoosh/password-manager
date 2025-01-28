import * as cheerio from 'cheerio';

const extractFaviconURL = async (websiteUrl: string) => {
  try {
    if (!websiteUrl.startsWith('http')) {
      websiteUrl = `https://www.${websiteUrl}`;
    }

    const response = await fetch(websiteUrl);
    if (!response.ok) {
      return null;
    }
    const html = await response.text();

    const $ = cheerio.load(html);

    let faviconUrl: string | null | undefined =
      $('link[rel~="icon"]').attr('href');

    if (faviconUrl) {
      if (!faviconUrl.startsWith('http')) {
        const baseUrl = new URL(websiteUrl).origin;
        faviconUrl = new URL(faviconUrl, baseUrl).href;
      }
    } else {
      faviconUrl = null;
    }

    return faviconUrl;
  } catch (error) {
    console.error(`Error extracting favicon: ${error}`);
    throw error;
  }
};

module.exports = {
  extractFaviconURL,
};

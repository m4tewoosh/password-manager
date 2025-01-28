import * as cheerio from 'cheerio';
import { URL } from 'url';

// Function to extract favicon from a given URL
const extractFaviconURL = async (websiteUrl: string) => {
  try {
    // Fetch the HTML content of the website

    if (!websiteUrl.startsWith('http')) {
      websiteUrl = `https://www.${websiteUrl}`;
    }

    const response = await fetch(websiteUrl);
    if (!response.ok) {
      return null;
    }
    const html = await response.text();

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Try to find the favicon link tag
    let faviconUrl: string | null | undefined =
      $('link[rel~="icon"]').attr('href');

    // If the favicon URL is relative, resolve it to an absolute URL
    if (faviconUrl) {
      if (!faviconUrl.startsWith('http')) {
        const baseUrl = new URL(websiteUrl).origin;
        faviconUrl = new URL(faviconUrl, baseUrl).href;
      }
    } else {
      // If no favicon is specified, default to /favicon.ico
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

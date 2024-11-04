// Define scraping functions for each site
import { cambiarGuionesAEspacio } from '../../frontend/src/assets/agregarMas.js'
/* const scrapePage = async (page, url, limit = 12, selectors = {}, platform = 'Unknown') => {
  await page.goto(url)

  // Wait for the main container to load, based on platform-specific selector
  await page.waitForSelector(selectors.container)

  return await page.evaluate(({ limit, selectors, platform }) => {
    const infoContainers = document.querySelectorAll(selectors.container)
    const results = []

    for (let i = 0; i < infoContainers.length && i < limit; i++) {
      const titleElement = infoContainers[i].querySelector(selectors.title)
      const priceElement = infoContainers[i].querySelector(selectors.price)
      const urlElement = infoContainers[i].querySelector(selectors.url)
      const imgElement = infoContainers[i].querySelector(selectors.image)
      const shippingPrice = infoContainers[i].querySelector(selectors.shippingPrice)
      const shippingTime = infoContainers[i].querySelector(selectors.shippingTime)
      if (titleElement && priceElement && urlElement && imgElement) {
        results.push({
          platform,
          title: titleElement.textContent.trim(),
          price: priceElement.textContent.trim(),
          url: urlElement.getAttribute('href'),
          image: imgElement.getAttribute('src'),
          shippingPrice: shippingPrice.textContent.trim(),
          shippingTime: shippingTime.textContent.trim()
        })
      }
    }
    return results
  }, { limit, selectors, platform })
} */

// Helper function for scraping MercadoLibre
const scrapeMercadoLibre = async (page, bookTitle, limit = 12) => {
  const domain = 'https://listado.mercadolibre.com.co'
  const url = `${domain}/${bookTitle}`
  await page.goto(url)

  // Wait for the search results to load
  await page.waitForSelector('.ui-search-layout')

  // Pass limit and bookTitle as properties of a single object
  const searchPageObject = await page.evaluate(({ limit, bookTitle, domain }) => {
    // const cambiarGuionesAEspacio = (text) => text.replace(/-/g, ' ') // Define function in browser context

    const infoContainers = document.querySelectorAll('.poly-card--list')
    const objects = []

    for (let i = 0; i < infoContainers.length && i < limit; i++) {
      const titleElement = infoContainers[i].querySelector('.poly-component__title')
      const priceElement = infoContainers[i].querySelector('.andes-money-amount__fraction')
      const urlElement = infoContainers[i].querySelector('.poly-component__title a')
      const imgElement = infoContainers[i].querySelector('.poly-card__portada img')
      if (titleElement && priceElement && urlElement && imgElement) {
        const titleText = titleElement.textContent.trim()

        // Use cambiarGuionesAEspacio to check for the processed book title
        if (!titleText.toLowerCase().includes(bookTitle.toLowerCase())) continue

        objects.push({
          platform: 'Mercado libre',
          domain,
          title: titleText,
          price: priceElement.textContent.trim(),
          url: urlElement.getAttribute('href'),
          image: imgElement.getAttribute('src')
        })
      }
    }
    return objects
  }, { limit, bookTitle: cambiarGuionesAEspacio(bookTitle), domain }) // Wrap both values in an object

  return searchPageObject
}
const scrapeAmazon = async (page, bookTitle, limit = 12) => {
  const domain = 'https://www.amazon.com'
  const url = `${domain}/s?k=${encodeURIComponent(bookTitle)}`
  await page.goto(url, { waitUntil: 'domcontentloaded' }) // Navigate to the Amazon search page

  // Wait for the search results to load
  await page.waitForSelector('.s-main-slot .s-result-item')

  // Extract data from the page
  const searchPageObject = await page.evaluate(({ limit, bookTitle, domain }) => {
    const infoContainers = document.querySelectorAll('.s-main-slot .s-result-item') // Select the relevant items
    const objects = []

    for (let i = 0; i < infoContainers.length && i < limit; i++) {
      const titleElement = infoContainers[i].querySelector('h2 .a-text-normal') // Title selector
      const priceElement = infoContainers[i].querySelector('.a-price-whole') // Price selector
      const urlElement = infoContainers[i].querySelector('h2 a.a-link-normal') // URL selector
      const imgElement = infoContainers[i].querySelector('.s-image') // Image selector

      if (titleElement && priceElement && urlElement && imgElement) {
        const titleText = titleElement.textContent.trim()

        // Check if the title includes the book title being searched for
        if (!titleText.toLowerCase().includes(bookTitle.toLowerCase())) continue

        objects.push({
          platform: 'Amazon',
          domain,
          title: titleText,
          price: priceElement.textContent.trim(),
          url: `${domain}${urlElement.getAttribute('href')}`, // Construct full URL
          image: imgElement.getAttribute('src')
        })
      }
    }
    return objects
  }, { limit, bookTitle, domain }) // Pass parameters to the browser context

  return searchPageObject
}

const scrapingFunctions = [
  scrapeMercadoLibre,
  scrapeAmazon
]
export { scrapingFunctions }

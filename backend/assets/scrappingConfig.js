// Define scraping functions for each site

const cambiarGuionesAEspacio = (text) => text.replace(/-/g, ' ') // Function to replace hyphens with spaces

const scrapeMercadoLibre = async (page, bookTitle, limit = 12) => {
  const url = `https://listado.mercadolibre.com.co/${bookTitle}`
  await page.goto(url)

  // Wait for the search results to load
  await page.waitForSelector('.ui-search-layout')

  // Pass `limit` and `bookTitle` as properties of a single object
  const searchPageObject = await page.evaluate(({ limit, bookTitle }) => {
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

        // Use `cambiarGuionesAEspacio` to check for the processed book title
        // if (!titleText.includes(cambiarGuionesAEspacio(bookTitle))) continue

        objects.push({
          title: titleText,
          price: priceElement.textContent.trim(),
          url: urlElement.getAttribute('href'),
          image: imgElement.getAttribute('src')
        })
      }
    }
    return objects
  }, { limit, bookTitle: cambiarGuionesAEspacio(bookTitle) }) // Wrap both values in an object

  return searchPageObject
}

const scrapingFunctions = [
  scrapeMercadoLibre
]
export { scrapingFunctions }

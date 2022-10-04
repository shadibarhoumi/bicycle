import { SearchResult } from '@models/SearchResult'

interface WikiPage {
  extract: string
  pageimage: string
  ns: number
  title: string
  pageid: number
  thumbnail: {
    source: string
    width: number
    height: number
  }
}

interface WikiResult {
  query: {
    pages: {
      [pageNumber: string]: WikiPage
    }
  }
}

interface ImageResult {
  query: {
    pages: {
      [key: number]: {
        imageinfo: { url: string; descriptionurl: string }[]
        imagerepository: string
        known: string
        missing: string
        ns: number
        title: string
      }
    }
  }
}

export async function searchWikipedia(
  searchQuery: string,
): Promise<{ result: SearchResult | null; error?: string }> {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${searchQuery}`
  const response = await fetch(endpoint)
  if (!response.ok) {
    return { result: null, error: response.statusText }
  }
  const results = await response.json()
  const { search } = results.query
  if (!search.length) {
    return { result: null }
  }
  const result = search[0]
  const { title: pageTitle } = result

  const snippetEndpoint = `https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts|pageimages&exintro=1&explaintext=1&titles=${pageTitle}`
  const snippetResponse = await fetch(snippetEndpoint)
  if (!snippetResponse.ok) {
    return { result: null, error: snippetResponse.statusText }
  }
  const snippetResults: WikiResult = await snippetResponse.json()
  const { pages } = snippetResults.query
  const pagesList = Object.values(pages)
  if (!pagesList.length) {
    return { result: null }
  }
  const snippetResult = pagesList[0]

  const resultWithoutImage = { result: snippetResult }

  if (!snippetResult.pageimage) {
    return resultWithoutImage
  }

  const imageFilename = snippetResult.pageimage
  const imageEndpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=Image:${imageFilename}&prop=imageinfo&iiprop=url`
  const imageResponse = await fetch(imageEndpoint)
  if (!imageResponse.ok) {
    return resultWithoutImage
  }
  const imageResults: ImageResult = await imageResponse.json()
  const { pages: imagePages } = imageResults.query
  const imageList = Object.values(imagePages)
  if (!imageList.length) {
    return resultWithoutImage
  }

  const firstImage = imageList[0]
  if (firstImage.imageinfo && firstImage.imageinfo.length) {
    return { result: { ...snippetResult, imageInfo: firstImage.imageinfo[0] } }
  }

  return resultWithoutImage
}

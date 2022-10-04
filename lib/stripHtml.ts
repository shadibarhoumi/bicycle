export const stripHtml = (string: string) =>
  string.replace(/(<([^>]+)>)|(&.*?;)/gi, '')

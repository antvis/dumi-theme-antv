export function getCategoryId(topicId, exampleId) {
  return [topicId, exampleId].join('-').replace(/\s/g, '')
}
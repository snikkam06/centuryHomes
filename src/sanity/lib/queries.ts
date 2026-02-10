import { groq } from 'next-sanity'

export const projectsQuery = groq`*[_type == "project"] | order(lotNumber asc) {
  _id,
  title,
  lotNumber,
  address,
  bedrooms,
  bathrooms,
  sqFt,
  status,
  mainImage
}`

export const settingsQuery = groq`*[_type == "settings"][0] {
  companyName,
  contactEmail,
  phoneNumber,
  logo
}`

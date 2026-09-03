import { redirect } from 'next/navigation'

/**
 * `/docs` had no page of its own, so it 404'd - an easy URL for someone to
 * type or for an external link to point at. Introduction is the right landing
 * spot for anyone arriving without a specific component in mind.
 */
export default function DocsIndex() {
  redirect('/docs/introduction')
}

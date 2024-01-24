export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/admin', '/admin/(setting|menu|order)', '/admin/(setting|menu|order)/(.*)'],
}
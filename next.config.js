/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'files.edgestore.dev',
                pathname: '/t9sauqldw2t9najq/userAvatar/_public/*'
            }
        ]
    }
}

module.exports = nextConfig
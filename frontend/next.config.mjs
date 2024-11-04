/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        domains: ['images.pexels.com'],
    },
    reactStrictMode: false
};
export default nextConfig;

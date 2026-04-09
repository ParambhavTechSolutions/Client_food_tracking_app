/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false, // Enable PWA in development for testing
});

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);

const { withNextVideo } = require('next-video/process')

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "utfs.io"
        ]
    }
}

module.exports = withNextVideo(nextConfig)

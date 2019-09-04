const withSass = require('@zeit/next-sass')
const withImages = require('next-images')
const withFonts = require('next-fonts')
module.exports = withFonts(withImages(withSass({
    target: "serverless"
})))

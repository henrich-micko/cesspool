const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@context': path.resolve(__dirname, 'src/context'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@types': path.resolve(__dirname, 'src/types'),
            '@permissions': path.resolve(__dirname, 'src/permissions'),
            '@views': path.resolve(__dirname, 'src/views'),
            '@styles': path.resolve(__dirname, 'src/styles'),
        },
    },
};
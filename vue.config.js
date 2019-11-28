module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://dev.gavln.com/',
        secure: false,
        ws: true,
        changeOrigin: true,
      },
    },
  },
};

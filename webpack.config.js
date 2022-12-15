module.exports = function (webpackEnv) {
  return {
    resolve: {
      extensions: [".js", ".json", ".ts", ".tsx"],
      fallback: {
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify")
      }
    }
  }
}

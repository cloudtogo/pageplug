const CracoAlias = require("craco-alias");
const CracoLessPlugin = require('craco-less');
const { DefinePlugin, EnvironmentPlugin } = require("webpack");

module.exports = {
  devServer: {
    open: false,
    client: {
      webSocketURL: {
        hostname: "127.0.0.1",
        pathname: "/ws",
        port: 3000,
        protocol: "ws",
      },
    },
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          assert: false,
          stream: false,
          util: false,
          fs: false,
          os: false,
          path: false,
        },
      },
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: { fullySpecified: false },
          },
        ],
      },
      ignoreWarnings: [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes("node_modules") &&
            warning.details &&
            warning.details.includes("source-map-loader")
          );
        },
      ],
    },
    plugins: [
      new DefinePlugin({
        ENABLE_INNER_HTML: true,
        ENABLE_ADJACENT_HTML: true,
        ENABLE_TEMPLATE_CONTENT: true,
        ENABLE_CLONE_NODE: true,
        ENABLE_SIZE_APIS: false
      }),
      new EnvironmentPlugin({
        TARO_ENV: 'h5',
      }),
    ]
  },
  style: {
    postcss: {
      mode: 'file',
    }
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: "./src",
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: "./tsconfig.path.json",
      },
    },
    {
      plugin: "prismjs",
      options: {
        languages: ["javascript"],
        plugins: [],
        theme: "twilight",
        css: false,
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // MINT_GREEN #2CBBA6
            modifyVars: { '@primary-color': process.env.REACT_APP_IN_CLOUDOS ? '#613eea' : '#2CBBA6' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  typescript: {
    enableTypeChecking: false
  },
  // babel: {
  //   plugins: [
  //     [
  //       "import",
  //       {
  //         libraryName: "@taroify/core",
  //         libraryDirectory: "",
  //         style: true,
  //       },
  //       "@taroify/core",
  //     ],
  //     [
  //       "import",
  //       {
  //         libraryName: "@taroify/icons",
  //         libraryDirectory: "",
  //         camel2DashComponentName: false,
  //         style: () => "@taroify/icons/style",
  //       },
  //       "@taroify/icons",
  //     ],
  //   ],
  // }
};

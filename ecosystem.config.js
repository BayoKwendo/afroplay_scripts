module.exports = {
    apps: [
      {
        name: "loan",
        script: "server.ts",
        interpreter: "./deno",
        interpreterArgs: "run --allow-write --allow-read --allow-net --allow-env --unstable",
      },
    ],
  };
  

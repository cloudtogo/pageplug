declare module "worker-loader?filename=worker.js!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

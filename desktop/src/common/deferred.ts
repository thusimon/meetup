class Deferred<T> {
  promise: Promise<T>
  reject: (reason?: any) => void
  resolve: (value: T) => void
  constructor() {
    this.promise = new Promise((resolve, reject)=> {
      this.reject = reject
      this.resolve = resolve
    });
  }
}

export default Deferred;

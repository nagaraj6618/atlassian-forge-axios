export class ForgeAxiosTimeoutError extends Error{
   constructor(message: string){
      super(message);
      this.name = "ForgeAxiosTimeoutError";
   }
}

export function withTimeout<T>(
   promise: Promise<T>,
   ms?: number,
   message = "Request timed out"
): Promise<T> {
   if(!ms || ms <=0) return promise;

   return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
         reject(new ForgeAxiosTimeoutError(`${message} (${ms}ms)`));
      }, ms);

      promise
         .then((res) => {
            clearTimeout(timer);
            resolve(res);
         })
         .catch((err) => {
            clearTimeout(timer);
            reject(err);
         });
   });
}
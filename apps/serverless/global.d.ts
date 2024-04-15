declare namespace NodeJS {
  interface ProcessEnv {
    CONFIGCAT_API_KEY: string;
    OPENAI_API_KEY: string;
  }
}

declare namespace awslambda {
  type HttpResponseStream = any; // Type definition for HttpResponseStream

  type StreamifyResponseHandler = (
    event: any,
    responseStream: HttpResponseStream, // Type definition for Lambda response stream
    context: any // Type definition for Lambda context
  ) => Promise<
    | {
        statusCode: number;
        body: string;
      }
    | undefined
  >;

  function streamifyResponse(handler: StreamifyResponseHandler): any; // Type definition for streamifyResponse function
}

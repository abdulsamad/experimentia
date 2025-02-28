import { isRouteErrorResponse } from 'react-router';

import type { Route } from './+types/root';

const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-200">
      <div className="w-full px-16 md:px-0 flex items-center justify-center">
        <div className="bg-white  border border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
          <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">
            <img src="/feeling_blue.svg" alt="Something went wrong" width={400} height={400} />
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">
            Client Error
          </h1>
          <h1>{message}</h1>
          <p className="text-gray-500 max-w-[700px] mt-8 py-2 border-y-2 text-center">
            Whoops, Something went wrong.
          </p>
          {/* <p>{details}</p> */}
          {stack && (
            <pre className="w-full p-4 overflow-x-auto">
              <code>{stack}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;

'use client';
import React from 'react';
import Image from 'next/image';

const Error = () => {
  return (
    <div className="bg-gray-200 w-full px-16 md:px-0 h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
        <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">
          <Image src="feeling_blue.svg" alt="Something went wrong" width={400} height={400} />
        </p>
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">
          Client Error
        </h1>
        <p className="text-gray-500 max-w-[700px] mt-8 py-2 border-y-2 text-center">
          Whoops, Something went wrong. Experimentia is supported only on webkit based browser such
          as Chrome. Please try again with Chrome.
        </p>
      </div>
    </div>
  );
};

export default Error;

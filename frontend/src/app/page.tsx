"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
          SPEED - Software Practice Empirical Evidence Database
        </h1>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          A platform for software engineering practitioners to find and submit evidence about software engineering practices.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/practices"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Browse Practices
          </Link>
          
          <Link
            href="/submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Submit Evidence
          </Link>
        </div>
      </div>
      
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">About SPEED</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Researchers</h3>
            <p className="text-gray-600">
              Submit your research findings and contribute to the growing body of evidence in software engineering.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Practitioners</h3>
            <p className="text-gray-600">
              Find evidence-based practices to improve your software development processes and outcomes.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Educators</h3>
            <p className="text-gray-600">
              Access curated evidence to enhance your teaching of software engineering concepts and practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
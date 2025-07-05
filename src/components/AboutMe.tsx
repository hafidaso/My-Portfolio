import React from 'react';
import Image from 'next/image';
import heroImage from "@/assets/hafida.jpeg";
import { GithubIcon, Linkedin } from 'lucide-react';
import { AnimatedLink } from './MicroInteractions';

const AboutMe: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-4 h-full transition-colors">
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-8">
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <Image
              src={heroImage}
              alt="Hafida's profile picture"
              className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover ring-2 ring-orange-500/20"
              priority
            />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col h-full">
                              <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Hafida Belayd
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">@hafidaso</p>
                </div>
              
              <div className="flex-1 bg-gray-50 dark:bg-[#1E2330] rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 mt-4">
                <div className="space-y-3">
                  <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 leading-relaxed">
                    Hey there, I&apos;m Hafida — a Data Analyst with a strong background in data science, based in Salé, Morocco.
                    I specialize in turning raw data into meaningful insights that drive smart decisions. From building dashboards to running predictive models, I love exploring data to uncover patterns and trends that matter.
                  </p>
                  <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 leading-relaxed">
                    I&apos;m especially passionate about using AI and advanced analytics to solve real-world problems and create value for businesses and communities.
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center space-x-4">
                  <AnimatedLink 
                    href="https://github.com/hafidaso"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </AnimatedLink>
                  <AnimatedLink 
                    href="https://linkedin.com/in/hafida-belayd"
                    className="text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </AnimatedLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
import AIChatButton from "./AIChatButton";
import { Github, Linkedin, Mail, Phone, Heart } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="footer-sa bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white pb-20">
        <div className="container mx-auto px-4 section-padding border-t border-gray-300 dark:border-gray-600 pt-16">
          <div className="contact-info">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Logo Section */}
              <div className="logo-section text-center md:text-left">
                <a href="#" className="logo block mb-6">
                  <h2 className="text-3xl font-bold text-orange-500 dark:text-orange-400 relative mb-2">
                    H ∩ B
                    <span className="text-xs text-orange-400 dark:text-orange-300 absolute -top-1 -right-1">©</span>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Hafida Belayd — Data Analyst & AI Specialist</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Developer & Designer | Expert in Python, Machine Learning, and Data Visualization</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Morocco</p>
                </a>
              </div>
              
              {/* Column 2: Social Links */}
              <div className="social-section text-center">
                <h3 className="text-orange-500 dark:text-orange-400 text-sm font-medium uppercase tracking-wider mb-4">
                  Follow Me
                </h3>
                <div className="social-icon flex justify-center space-x-4">
                  <a 
                    href="https://github.com/hafidaso" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-300 text-gray-700 dark:text-white"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/hafida-belayd/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-300 text-gray-700 dark:text-white"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a 
                    href="mailto:hafidabelaidagnaoui@gmail.com"
                    className="w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-300 text-gray-700 dark:text-white"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
              </div>
              
              {/* Column 3: Contact Section */}
              <div className="contact-section text-center md:text-right">
                <h3 className="text-orange-500 dark:text-orange-400 text-sm font-medium uppercase tracking-wider mb-4">
                  Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-end text-gray-700 dark:text-gray-200">
                    <Mail className="w-4 h-4 mr-2 text-orange-500 dark:text-orange-300" />
                    <p>hafidabelaidagnaoui@gmail.com</p>
                  </div>
                  <div className="flex items-center justify-center md:justify-end text-gray-700 dark:text-gray-200">
                    <Phone className="w-4 h-4 mr-2 text-orange-500 dark:text-orange-300" />
                    <p>+212 665 907 915</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sub Footer */}
        <div className="sub-footer border-t border-gray-300 dark:border-gray-600 pt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Copyright */}
              <div className="lg:col-span-8">
                <div className="copy text-gray-600 dark:text-gray-300 text-sm">
                  <p>© 2025 <Heart className="inline-block w-4 h-4 text-orange-500 dark:text-orange-400 mx-2" /> <a href="#" className="text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">Hafida Belayd</a>. All Rights Reserved</p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="lg:col-span-4 lg:text-right">
                <div className="links text-gray-600 dark:text-gray-300 text-sm flex flex-wrap justify-center lg:justify-end space-x-6">
                  <a href="/websites" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Websites</a>
                  <a href="/graphics" className="hover:text-orange-400 transition-colors">Graphics</a>
                  <a href="/data-science" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">My Planet in Data</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Chat Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900">
        <AIChatButton />
      </div>
    </>
  );
}
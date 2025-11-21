import React from 'react';
import { Shield } from 'lucide-react';

const Resources = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 max-w-lg mx-auto">
        Safety Resources & Tips
      </h1>

      <section className="space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-pink-500 flex items-center">
          <Shield className="mr-2" size={20} /> Digital & Physical Tips
        </h2>
        <ul className="list-none space-y-3 text-gray-300 bg-gray-800 p-5 rounded-xl shadow">
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 text-xl font-bold">1.</span>
            *Virtual Safety:* Always use strong passwords and two-factor authentication on all critical accounts.
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 text-xl font-bold">2.</span>
            *Travel Plan:* Inform someone of your route and estimated time of arrival before you leave.
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 text-xl font-bold">3.</span>
            *The L-Rule:* If using an elevator with a stranger, stand at the wall farthest from the control panel in an 'L' shape for better protection.
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2 text-xl font-bold">4.</span>
            *Situational Awareness:* Avoid using headphones that block out all ambient noise when walking alone in low-light areas.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Resources;
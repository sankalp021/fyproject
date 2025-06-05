import React from 'react';

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  // Parse content into sections using the new bracket format
  const sections = {};
  if (content) {
    const matches = content.match(/\[(.*?)\](.*?)(?=\[|$)/gs);
    if (matches) {
      matches.forEach(match => {
        const [, header, text] = match.match(/\[(.*?)\](.*)/s);
        if (!['CONTEXT', 'INSTRUCTIONS'].includes(header)) {
          // Clean up the text: remove any asterisks and ensure proper bullet points
          const cleanText = text
            .trim()
            .replace(/\*/g, '') // Remove asterisks
            .replace(/•/g, '•') // Standardize bullet points
            .replace(/^\s*[-•]\s*/gm, '• '); // Convert any dash bullets to bullet points
          sections[header] = cleanText;
        }
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-6 flex justify-between items-center bg-gradient-to-r from-primaryColor to-irisBlueColor">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {Object.keys(sections).length > 0 ? (
            <div className="grid gap-6">
              {/* Risk Assessment */}
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Risk Assessment</h3>
                <div className="text-blue-700 whitespace-pre-line">{sections['RISK ASSESSMENT']}</div>
              </div>

              {/* Key Factors */}
              <div className="bg-amber-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-amber-800 mb-3">Key Factors</h3>
                <div className="text-amber-700 space-y-2">{sections['KEY FACTORS']}</div>
              </div>

              {/* Lifestyle Recommendations */}
              <div className="bg-green-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Lifestyle Recommendations</h3>
                <div className="text-green-700 space-y-2">{sections['LIFESTYLE RECOMMENDATIONS']}</div>
              </div>

              {/* Warning Signs */}
              <div className="bg-red-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-red-800 mb-3">Warning Signs</h3>
                <div className="text-red-700 space-y-2">{sections['WARNING SIGNS']}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">{content}</div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

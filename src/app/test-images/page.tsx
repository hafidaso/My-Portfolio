import Image from 'next/image';

export default function TestImages() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl mb-4">Test 1: Direct Image Path</h2>
          <div className="border p-4 rounded">
            <Image
              src="/images/compound-effect-programming-ai.jpg"
              alt="Compound Effect"
              width={400}
              height={200}
              className="rounded"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-4">Test 2: HTML img tag</h2>
          <div className="border p-4 rounded">
            <img
              src="/images/compound-effect-programming-ai.jpg"
              alt="Compound Effect HTML"
              width={400}
              height={200}
              className="rounded"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-4">Test 3: Different Image</h2>
          <div className="border p-4 rounded">
            <Image
              src="/images/how-to-protect-your-data-in-the-age-of-ai.jpg"
              alt="Data Protection"
              width={400}
              height={200}
              className="rounded"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-4">Test 4: PNG Image</h2>
          <div className="border p-4 rounded">
            <Image
              src="/images/model-context-protocol-ai-integration-standard.png"
              alt="MCP"
              width={400}
              height={200}
              className="rounded"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-4">Debug Info</h2>
          <pre className="bg-gray-100 p-4 text-sm">
            {`Expected image paths:
- /images/compound-effect-programming-ai.jpg
- /images/how-to-protect-your-data-in-the-age-of-ai.jpg
- /images/model-context-protocol-ai-integration-standard.png`}
          </pre>
        </div>
      </div>
    </div>
  );
}

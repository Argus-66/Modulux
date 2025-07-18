import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Your Dream Portfolio with <span className="text-blue-600">Modulux</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create stunning, professional portfolios in minutes with our drag-and-drop builder. 
            No coding required — just pure creativity and seamless deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="primary" className="text-lg px-10 py-4">
              Start Building Free
            </Button>
            <Button variant="secondary" className="text-lg px-10 py-4">
              View Templates
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

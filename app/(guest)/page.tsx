import Footer from "@/components/footer";
import SearchComponent from "@/components/search-component";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200">
      
      {/* 1. Search Section - The absolute top of the page */}
      <section className="relative pt-24 pb-12">
        <SearchComponent />
      </section>

      {/* 2. Value Proposition */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h3 className="text-4xl md:text-6xl font-black text-white text-center tracking-tighter">
          There is always a <span className="text-purple-500">spot available.</span>
        </h3>
        <p className="text-center text-slate-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          No more running around looking for a parking spot. Book your space in seconds and drive straight to your destination.
        </p>
      </div>

      {/* 3. Modernized Steps Section */}
      <section className="py-24 bg-black/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Background Connector Line (Hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent -z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center text-3xl font-black text-purple-400 group-hover:scale-110 transition-all duration-500 group-hover:shadow-purple-500/20">
                1
              </div>
              <div className="mt-8 text-center">
                <h4 className="text-xl font-bold text-white">Enter destination</h4>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">Tell us where you're heading in the city.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center text-3xl font-black text-purple-400 group-hover:scale-110 transition-all duration-500 group-hover:shadow-purple-500/20">
                2
              </div>
              <div className="mt-8 text-center">
                <h4 className="text-xl font-bold text-white">Pick date and time</h4>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">Select your arrival and departure schedule.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10 group">
              <div className="w-24 h-24 rounded-[2rem] bg-purple-600 shadow-2xl shadow-purple-900/40 flex items-center justify-center text-3xl font-black text-white group-hover:scale-110 transition-all duration-500">
                3
              </div>
              <div className="mt-8 text-center">
                <h4 className="text-xl font-bold text-white">Pick a spot</h4>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">Choose from the best available gated spots.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-8">
            Park smarter in <span className="text-purple-500">Nepal.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Join thousands of drivers who have ditched the ticket and moved Autospace.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
import { useEffect } from 'react';
import { Layers, ArrowDown, CheckCircle2, Laptop, Car, Building2, Wrench } from 'lucide-react';

export default function HeroAsciiOne() {
  useEffect(() => {
    const embedScript = document.createElement('script');
    embedScript.type = 'text/javascript';
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] { position: relative !important; overflow: hidden !important; }
      [data-us-project] canvas { clip-path: inset(0 0 10% 0) !important; }
      [data-us-project] * { pointer-events: none !important; }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
        position: absolute !important; left: -9999px !important; top: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    const hideBranding = () => {
      const selectors = ['[data-us-project]', '[data-us-project="OMzqyUv6M3kSnv0JeAtC"]'];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(container => {
          container.querySelectorAll('*').forEach(el => {
            const htmlEl = el as HTMLElement;
            const text = (htmlEl.textContent || '').toLowerCase();
            const title = (htmlEl.getAttribute('title') || '').toLowerCase();
            const href = (htmlEl.getAttribute('href') || '').toLowerCase();
            if (text.includes('made with') || text.includes('unicorn') || title.includes('unicorn') || href.includes('unicorn.studio')) {
              htmlEl.style.display = 'none';
              try { htmlEl.remove(); } catch (_e) { /* noop */ }
            }
          });
        });
      });
    };
    hideBranding();
    const interval = setInterval(hideBranding, 100);
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 5000);
    return () => { clearInterval(interval); document.head.removeChild(embedScript); document.head.removeChild(style); };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Animation */}
      <div className="absolute inset-0 w-full h-full hidden lg:block">
        <div data-us-project="OMzqyUv6M3kSnv0JeAtC" style={{ width: '100%', height: '100%', minHeight: '100vh' }} />
      </div>
      <div className="absolute inset-0 w-full h-full lg:hidden stars-bg"></div>

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b border-white/15 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 rounded-md bg-brand-900 flex items-center justify-center border border-brand-700/50">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-sans text-white text-lg lg:text-xl font-bold tracking-tight">
              Asset<span className="text-brand-400">Flow</span>
            </span>
            <div className="h-4 w-px bg-white/30 ml-2"></div>
            <span className="text-white/50 text-[9px] font-mono">ERP v2.4</span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono text-white/50">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>SOC2 TYPE II</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <span>ISO 27001</span>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <span>GDPR READY</span>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 lg:w-10 lg:h-10 border-t-2 border-l-2 border-white/20 z-20"></div>
      <div className="absolute top-0 right-0 w-8 h-8 lg:w-10 lg:h-10 border-t-2 border-r-2 border-white/20 z-20"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 lg:w-10 lg:h-10 border-b-2 border-l-2 border-white/20 z-20"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 border-b-2 border-r-2 border-white/20 z-20"></div>

      {/* Main CTA Content */}
      <div className="relative z-10 flex min-h-screen items-center pt-16 lg:pt-0">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 lg:pr-[8%] ml-auto">
          <div className="max-w-xl relative lg:ml-auto">
            {/* Decorative top line */}
            <div className="flex items-center gap-2 mb-4 opacity-50">
              <div className="w-8 h-px bg-brand-400"></div>
              <span className="text-brand-400 text-[10px] font-mono tracking-wider">ENTERPRISE ASSET MANAGEMENT</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              Digitize Your
              <br />
              <span className="text-brand-400">Asset Lifecycle.</span>
            </h1>

            {/* Description */}
            <p className="text-sm lg:text-base text-gray-300 mb-6 leading-relaxed max-w-md">
              Eliminate manual tracking. Centralize asset registration, resource booking, maintenance workflows, and compliance audits in one platform.
            </p>

            {/* Floating asset icons */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 border border-white/15 text-[11px] text-white/70 font-medium">
                <Laptop className="w-3.5 h-3.5 text-brand-400" />
                <span>IT Equipment</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 border border-white/15 text-[11px] text-white/70 font-medium">
                <Car className="w-3.5 h-3.5 text-brand-400" />
                <span>Fleet Vehicles</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 border border-white/15 text-[11px] text-white/70 font-medium">
                <Building2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Facilities</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 border border-white/15 text-[11px] text-white/70 font-medium">
                <Wrench className="w-3.5 h-3.5 text-brand-400" />
                <span>Tools</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#features" className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-md border border-brand-700/50 transition-colors text-center">
                Get Started
              </a>
              <a href="#how-it-works" className="px-6 py-3 bg-transparent border border-white/30 text-white font-semibold text-sm rounded-md hover:bg-white/10 transition-colors text-center">
                View Documentation
              </a>
            </div>

            {/* Bottom tech line */}
            <div className="hidden lg:flex items-center gap-2 mt-8 opacity-30">
              <div className="w-2 h-2 border border-white/50 rounded-sm"></div>
              <div className="flex-1 h-px bg-white/30"></div>
              <span className="text-white text-[9px] font-mono">ASSETFLOW.PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/15 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono text-white/40">
            <span>SYS.ONLINE</span>
            <div className="hidden lg:flex gap-0.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1 bg-brand-500/40" style={{ height: `${Math.random() * 12 + 4}px` }}></div>
              ))}
            </div>
            <span>V2.4.0</span>
          </div>
          <a href="#features" className="flex items-center gap-2 text-[9px] font-mono text-white/40 hover:text-white/70 transition-colors">
            <span className="hidden lg:inline">SCROLL TO EXPLORE</span>
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </a>
          <div className="flex items-center gap-2 text-[8px] lg:text-[9px] font-mono text-white/40">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-brand-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <span className="hidden lg:inline">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>

      <style>{`
        .stars-bg {
          background-image:
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 60%, white, transparent),
            radial-gradient(1px 1px at 70% 40%, white, transparent);
          background-size: 200% 200%, 180% 180%, 250% 250%, 220% 220%, 190% 190%, 240% 240%, 210% 210%, 230% 230%;
          opacity: 0.3;
        }
      `}</style>
    </section>
  );
}

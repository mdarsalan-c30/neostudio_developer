const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/20 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="text-3xl font-light text-foreground mb-4">
              NeoStudio<span className="text-muted-foreground">.</span>
            </div>
            <p className="text-muted-foreground mb-6 font-light max-w-md">
              Neostudio creates bold digital experiences and future-ready strategies that drive innovation and growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-card/50 border border-border/20 flex items-center justify-center hover:bg-card transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card/50 border border-border/20 flex items-center justify-center hover:bg-card transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/neostudio.global/" className="w-10 h-10 rounded-full bg-card/50 border border-border/20 flex items-center justify-center hover:bg-card transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987 6.62 0 11.987-5.366 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.7 13.718 3.7 12.321c0-1.297.498-2.448 1.297-3.323.875-.875 2.026-1.297 3.323-1.297s2.448.422 3.323 1.297c.875.875 1.297 2.026 1.297 3.323 0 1.297-.422 2.448-1.297 3.323-.875.875-2.026 1.297-3.323 1.297zm7.74 0c-1.297 0-2.448-.49-3.323-1.297-.875-.875-1.297-2.026-1.297-3.323 0-1.297.422-2.448 1.297-3.323.875-.875 2.026-1.297 3.323-1.297s2.448.422 3.323 1.297c.875.875 1.297 2.026 1.297 3.323 0 1.297-.422 2.448-1.297 3.323-.875.875-2.026 1.297-3.323 1.297z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Services</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-foreground transition-colors">SEO Optimization</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">PPC Advertising</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Brand Strategy</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Growth Analytics</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Content Marketing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#portfolio" className="hover:text-foreground transition-colors">Portfolio</a></li>
              <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 NeoStudio Digital Marketing. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
                <a href="/admin" className="hover:text-foreground transition-colors">Admin/a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</a>
              <a href="/sitemap" className="hover:text-foreground transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

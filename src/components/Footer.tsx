const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/20 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-foreground mb-4">
            Elite<span className="text-muted-foreground">.</span>
          </div>
          <p className="text-muted-foreground mb-6 font-light">
            Premium digital marketing solutions for exceptional brands.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
          <div className="mt-8 pt-8 border-t border-border/20 text-sm text-muted-foreground">
            © 2024 Elite Digital Marketing. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
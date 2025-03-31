
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-dark-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Film className="h-8 w-8 text-cinema-500" />
              <span className="ml-2 text-xl font-bold text-white">CineFellow</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Rechercher films & séries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-700 border-dark-600 focus:border-cinema-600 text-white w-64"
              />
              <Button type="submit" variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-300" />
              </Button>
            </form>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Accueil
            </Link>
            <Link to="/search?q=movie" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Films
            </Link>
            <Link to="/search?q=series" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Séries
            </Link>
            <Link to="/favorites" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              Favoris
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-800 shadow-lg pb-4 px-4 animate-fade-in">
          <form onSubmit={handleSearch} className="mt-4 mb-4">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Rechercher films & séries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-700 border-dark-600 text-white w-full"
              />
              <Button type="submit" variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-300" />
              </Button>
            </div>
          </form>
          <div className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/search?q=movie" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Films
            </Link>
            <Link 
              to="/search?q=series" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Séries
            </Link>
            <Link 
              to="/favorites" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="h-4 w-4 mr-1" />
              Favoris
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

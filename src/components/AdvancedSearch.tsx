
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const currentYear = new Date().getFullYear();

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [query, setQuery] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [yearRange, setYearRange] = useState([1900, currentYear]);
  const [searchMode, setSearchMode] = useState<'query' | 'yearRange'>('query');
  const [openDialog, setOpenDialog] = useState(false);

  // Initialize state from URL params
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const yearParam = searchParams.get('year');
    const yearFromParam = searchParams.get('yearFrom');
    const yearToParam = searchParams.get('yearTo');
    
    if (queryParam) {
      setQuery(queryParam);
      setSearchMode('query');
    }
    
    if (yearParam) {
      setYear(parseInt(yearParam));
    }
    
    if (yearFromParam && yearToParam) {
      setYearRange([parseInt(yearFromParam), parseInt(yearToParam)]);
      // If only year range parameters are present (no query), set mode to yearRange
      if (!queryParam) {
        setSearchMode('yearRange');
      }
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (searchMode === 'query') {
      if (query.trim()) {
        params.set('q', query.trim());
      }
      
      if (year) {
        params.set('year', year.toString());
      } else if (yearRange[0] !== 1900 || yearRange[1] !== currentYear) {
        params.set('yearFrom', yearRange[0].toString());
        params.set('yearTo', yearRange[1].toString());
      }
    } else {
      // Year range search mode
      params.set('yearFrom', yearRange[0].toString());
      params.set('yearTo', yearRange[1].toString());
    }
    
    navigate(`/search?${params.toString()}`);
    setOpenDialog(false);
  };

  return (
    <>
      {/* Mobile view - Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Filter className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recherche avancée</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue={searchMode} onValueChange={(value) => setSearchMode(value as 'query' | 'yearRange')}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="query">Par titre</TabsTrigger>
              <TabsTrigger value="yearRange">Par années</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSearch} className="space-y-4 pt-4">
              <TabsContent value="query" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile-search">Titre du film ou série</Label>
                  <Input
                    id="mobile-search"
                    placeholder="Rechercher..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile-year">Année spécifique</Label>
                  <Input
                    id="mobile-year"
                    type="number"
                    min="1900"
                    max={currentYear}
                    placeholder="Année de sortie"
                    value={year || ''}
                    onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="yearRange" className="space-y-4">
                <div className="space-y-2">
                  <Label>Plage d'années</Label>
                  <div className="pt-6 pb-2">
                    <Slider
                      defaultValue={yearRange}
                      min={1900}
                      max={currentYear}
                      step={1}
                      value={yearRange}
                      onValueChange={setYearRange}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>
              </TabsContent>
              
              <Button type="submit" className="w-full">Rechercher</Button>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Desktop view - Popover */}
      <div className="hidden md:flex items-center gap-2">
        <Tabs defaultValue={searchMode} onValueChange={(value) => setSearchMode(value as 'query' | 'yearRange')} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="query">Recherche par titre</TabsTrigger>
            <TabsTrigger value="yearRange">Recherche par années</TabsTrigger>
          </TabsList>
          
          <TabsContent value="query">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                placeholder="Rechercher un film ou une série..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-64"
              />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Calendar className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h3 className="font-medium">Filtrer par année</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="desktop-year">Année spécifique</Label>
                      <Input
                        id="desktop-year"
                        type="number"
                        min="1900"
                        max={currentYear}
                        placeholder="Année de sortie"
                        value={year || ''}
                        onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Plage d'années</Label>
                      <div className="pt-6 pb-2">
                        <Slider
                          defaultValue={yearRange}
                          min={1900}
                          max={currentYear}
                          step={1}
                          value={yearRange}
                          onValueChange={setYearRange}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button type="submit">
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="yearRange">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="w-80 space-y-2">
                <Label>Plage d'années</Label>
                <div className="pt-2 pb-2">
                  <Slider
                    defaultValue={yearRange}
                    min={1900}
                    max={currentYear}
                    step={1}
                    value={yearRange}
                    onValueChange={setYearRange}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
              
              <Button type="submit">
                <Calendar className="h-5 w-5 mr-2" />
                Rechercher par années
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdvancedSearch;

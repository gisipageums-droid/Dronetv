// ProductsPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ChevronDown,
  Package,
  Star,
  Eye,
  Zap,
  Shield,
  Cpu
} from "lucide-react";
import LoadingScreen from './loadingscreen'; // Adjust the import path as needed

/**
 * Types
 */
type RawApiItem = {
  publishedId?: string;
  userId?: string;
  products?: any;
  websiteContent?: any;
  websiteData?: any;
};

type ProductShape = {
  id: string | number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: string;
  rating: number;
  popularity: number;
  features: string[];
  featured?: boolean;
};

const ProductsPage: React.FC = () => {
  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductShape[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const productsPerPage = 12;

  // Data state
  const [products, setProducts] = useState<ProductShape[]>([]);

  // categories & sort options
  const categories = ["All", "Drones", "Sensors", "Accessories", "Software", "Batteries", "Cameras"];
  const sortOptions = [
    { value: "popularity", label: "Sort by Popularity" },
    { value: "price", label: "Sort by Price" },
    { value: "name", label: "Sort by Name" },
    { value: "rating", label: "Sort by Rating" }
  ];


 

  // Fetch API data on mount
  useEffect(() => {
    const API = "https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product/product/view";

    // Set a timeout for API call to avoid infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("API timeout - using static data");
        setProducts(staticProducts);
        setLoading(false);
        setDataLoaded(true);
      }
    }, 8000); // 8 second timeout

    axios
      .get(API)
      .then((res) => {
        clearTimeout(loadingTimeout);
        const payload = res.data;
        if (payload && Array.isArray(payload.data) && payload.data.length > 0) {
          const apiProducts: ProductShape[] = [];

          payload.data.forEach((item: RawApiItem) => {
            const content = item.products ?? item.websiteContent ?? item.websiteData?.content ?? {};
            const arr = content.products ?? [];

            if (Array.isArray(arr) && arr.length > 0) {
              arr.forEach((p: any, pIndex: number) => {
                const mapped: ProductShape = {
                  id: item.publishedId ?? `api-${pIndex}`,
                  name: p.title ?? p.name ?? p.heading ?? `Product ${pIndex + 1}`,
                  description: p.description ?? p.detailedDescription ?? p.desc ?? "",
                  image: p.image ?? p.url ?? p.thumbnail ?? "",
                  category: p.category ?? "Products",
                  price: (p.price && String(p.price)) ?? p.pricing ?? p.priceLabel ?? "₹0",
                  rating: Number(p.rating ?? p.reviews?.avg ?? 4.5) || 4.5,
                  popularity: Number(p.popularity ?? pIndex) || 0,
                  features: Array.isArray(p.features) ? p.features.map((f: any) => String(f)) : [],
                  featured: p.isPopular ?? false
                };
                apiProducts.push(mapped);
              });
            } else {
              const maybeSingle = content;
              if (maybeSingle && (maybeSingle.title || maybeSingle.image)) {
                const mapped: ProductShape = {
                  id: item.publishedId ?? "api-single",
                  name: maybeSingle.title ?? "Product",
                  description: maybeSingle.description ?? "",
                  image: maybeSingle.image ?? "",
                  category: maybeSingle.category ?? "Products",
                  price: (maybeSingle.price && String(maybeSingle.price)) ?? "₹0",
                  rating: Number(maybeSingle.rating ?? 4.5),
                  popularity: 0,
                  features: [],
                  featured: false
                };
                apiProducts.push(mapped);
              }
            }
          });

          if (apiProducts.length > 0) {
            setProducts(apiProducts);
          } else {
            console.warn("API returned but no products parsed, using static fallback.");
            setProducts(staticProducts);
          }
        } else {
          console.warn("API returned no data, using static fallback.");
          setProducts(staticProducts);
        }
      })
      .catch((err) => {
        clearTimeout(loadingTimeout);
        console.error("API Error:", err);
        setProducts(staticProducts);
      })
      .finally(() => {
        setLoading(false);
        setDataLoaded(true);
      });

    // Cleanup timeout
    return () => clearTimeout(loadingTimeout);
  }, []);

  // Filtering / Sorting
  useEffect(() => {
    if (!dataLoaded) return;

    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.features.some((feature) => feature.toLowerCase().includes(q))
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        case "price":
          const aPrice = parseFloat(String(a.price).replace(/[^0-9.]/g, "")) || 0;
          const bPrice = parseFloat(String(b.price).replace(/[^0-9.]/g, "")) || 0;
          return aPrice - bPrice;
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, sortBy, searchQuery, dataLoaded]);

  // Featured / Pagination helpers
  const featuredProducts = products.filter((product) => product.featured);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

  // Icons helpers
  const getCategoryIcon = (category?: string) => {
    switch ((category || "").toLowerCase()) {
      case "drones":
      case "agriculture drones":
      case "survey drones":
        return Zap;
      case "sensors":
        return Cpu;
      case "accessories":
        return Package;
      case "software":
        return Shield;
      case "batteries":
        return Zap;
      case "cameras":
        return Eye;
      default:
        return Package;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch ((category || "").toLowerCase()) {
      case "drones": return "bg-black";
      case "sensors": return "bg-gray-900";
      case "accessories": return "bg-gray-800";
      case "software": return "bg-gray-700";
      case "batteries": return "bg-gray-600";
      case "cameras": return "bg-black";
      default: return "bg-gray-800";
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return <LoadingScreen 
      logoSrc="/images/logo.png" 
      loadingText="Loading Products..." 
    />;
  }

  // JSX UI remains the same as your original code
  return (
    <div className="pt-16 min-h-screen bg-yellow-400">
      {/* Hero Section */}
      <section className="overflow-hidden relative py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse bg-yellow-200/30"></div>
          <div className="absolute right-10 bottom-10 w-40 h-40 rounded-full blur-2xl animate-pulse bg-yellow-600/20" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative z-10 px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <h1 className="mb-2 text-2xl font-black tracking-tight text-black md:text-5xl">
            Products Catalog
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-xl text-black/80">
            Explore advanced drones, sensors, and accessories for professionals.
          </p>
          <div className="mx-auto w-24 h-1 bg-black rounded-full"></div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-16 z-40 py-3 bg-yellow-400 border-b border-black/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 justify-between items-center lg:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-black/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pr-3 pl-10 w-full text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 placeholder-black/60"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 w-44 text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 appearance-none border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-black/60" />
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 w-44 text-sm font-medium text-black bg-yellow-200 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 appearance-none border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-black/60" />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategory !== "All" && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="text-sm transition-colors duration-200 hover:text-white">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="text-sm transition-colors duration-200 hover:text-white">×</button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredProducts.slice(0, 3).map((product, index) => {
              const IconComponent = getCategoryIcon(product.category);
              return (
                <div
                  key={product.id}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`
                  }}
                >
                  <div className="p-3">
                    <div className="overflow-hidden relative rounded-2xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-48 border-b-2 transition-all duration-700 group-hover:scale-110 border-black/10"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-all duration-500 from-black/60 group-hover:opacity-100"></div>

                      <div className="flex absolute inset-0 justify-center items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                        <Link
                          to={`/product/${product.id}`}
                          className="px-4 py-2 font-bold text-black bg-yellow-400 rounded-full shadow-2xl transition-all duration-500 transform scale-0 group-hover:scale-100 hover:bg-yellow-300"
                        >
                          View Details
                        </Link>
                      </div>

                      <div className={`absolute top-4 right-4 ${getCategoryColor(product.category)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}>
                        <IconComponent className="w-3 h-3" />
                        {product.category}
                      </div>

                      <div className="flex absolute right-4 bottom-4 gap-1 items-center px-2 py-1 text-xs font-medium text-white rounded-lg bg-black/80">
                        {product.price}
                      </div>

                      <div className="flex absolute top-4 left-4 gap-1 items-center px-2 py-1 text-xs font-bold text-black bg-yellow-400 rounded-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    </div>

                    <div className="p-6">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="mb-2 text-xl font-bold text-black transition-colors duration-300 cursor-pointer group-hover:text-gray-800">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mb-4 text-gray-600 line-clamp-2">{product.description}</p>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4 items-center text-sm text-gray-500">
                          <div className="flex gap-1 items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {product.rating}
                          </div>
                        </div>
                        <div className="text-xl font-bold text-black">{product.price}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-300 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-black md:text-4xl">
              All Products ({filteredProducts.length})
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentProducts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="p-12 mx-auto max-w-md rounded-3xl backdrop-blur-sm bg-white/80">
                <Search className="mx-auto mb-4 w-16 h-16 text-black/40" />
                <h3 className="mb-2 text-2xl font-bold text-black">No products found</h3>
                <p className="text-black/60">Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProducts.map((product, index) => {
                const IconComponent = getCategoryIcon(product.category);
                return (
                  <div
                    key={product.id}
                    className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 border-2 border-black/20 hover:border-black/40"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
                    }}
                  >
                    <div className="overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-40 transition-all duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-all duration-500 from-black/60 group-hover:opacity-100"></div>

                      <div className="flex absolute inset-0 justify-center items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                        <Link
                          to={`/product/${product.id}`}
                          className="px-6 py-3 font-bold text-black bg-yellow-400 rounded-full shadow-2xl transition-all duration-500 transform scale-0 group-hover:scale-100 hover:bg-yellow-300"
                        >
                          View Details
                        </Link>
                      </div>

                      <div className={`absolute top-3 right-3 ${getCategoryColor(product.category)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                        <IconComponent className="w-3 h-3" />
                        {product.category}
                      </div>

                      <div className="flex absolute right-3 bottom-3 gap-1 items-center px-2 py-1 text-xs font-medium text-white rounded-lg bg-black/80">
                        {product.price}
                      </div>
                    </div>

                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="mb-2 text-lg font-bold text-black transition-colors duration-300 cursor-pointer group-hover:text-gray-800 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mb-3 text-sm text-gray-600 line-clamp-2">{product.description}</p>

                      <div className="flex justify-between items-center mb-3 text-xs">
                        <div className="flex gap-1 items-center text-gray-500">
                          <Star className="w-3 h-3 text-yellow-600 fill-current" />
                          {product.rating}
                        </div>
                        <div className="text-lg font-bold text-black">{product.price}</div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-300 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 font-medium text-black rounded-xl border-2 backdrop-blur-sm transition-all duration-300 bg-white/80 border-black/20 hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (page === currentPage || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${page === currentPage
                          ? "bg-black text-yellow-400 border-2 border-black"
                          : "bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black hover:bg-white hover:border-black/40"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-black/60">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 font-medium text-black rounded-xl border-2 backdrop-blur-sm transition-all duration-300 bg-white/80 border-black/20 hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
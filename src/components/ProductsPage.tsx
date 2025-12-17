
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
  Cpu,
  Building2,
  MapPin
} from "lucide-react";
import LoadingScreen from './loadingscreen';

/**
 * Types
 */
interface Product {
  id: string;
  publishedId: string;
  userId: string;
  companyName: string;
  title: string;
  description: string;
  detailedDescription: string;
  image: string;
  category: string;
  price: string;
  rating: number;
  popularity: number;
  features: string[];
  featured: boolean;
  isPopular?: boolean;
  timeline?: string;
  timestamp?: string;
}

interface ApiResponseItem {
  publishedId: string;
  userId: string;
  companyName: string;
  type: string;
  timestamp: string;
  products: {
    products: any[];
    categories?: string[];
    trustText?: string;
  };
}

const ProductsPage: React.FC = () => {
  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("timestamp");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productsPerPage = 12;

  // Data state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  const sortOptions = [
    { value: "timestamp", label: "Sort by Newest" },
    { value: "popularity", label: "Sort by Popularity" },
    { value: "rating", label: "Sort by Rating" },
    { value: "company", label: "Sort by Company" },
    { value: "title", label: "Sort by Name" }
  ];

  // Fetch API data on mount
  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      setError(null);

      const API_URL = "https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product/product/view";

      axios
        .get(API_URL)
        .then((response) => {
          const responseData = response.data;

          if (responseData.status && responseData.data && Array.isArray(responseData.data)) {
            const apiProducts: Product[] = [];
            const allCategories = new Set<string>(['All']);

            responseData.data.forEach((item: ApiResponseItem) => {
              // Check if products array exists and has at least one product
              if (item.products &&
                item.products.products &&
                Array.isArray(item.products.products) &&
                item.products.products.length > 0) {

                // Add categories from this item
                if (item.products.categories && Array.isArray(item.products.categories)) {
                  item.products.categories.forEach((cat: string) => {
                    if (cat && cat !== 'All') allCategories.add(cat);
                  });
                }

                // Process each product in the products array
                item.products.products.forEach((product: any, index: number) => {
                  // Only process products that have at least a title
                  if (product && product.title) {
                    const mappedProduct: Product = {
                      id: `${item.publishedId}-${index}`,
                      publishedId: item.publishedId,
                      userId: item.userId,
                      companyName: item.companyName,
                      title: product.title || "Untitled Product",
                      description: product.description || product.detailedDescription || "No description available",
                      detailedDescription: product.detailedDescription || product.description || "",
                      image: product.image || "/images/product-placeholder.jpg",
                      category: product.category || "General",
                      price: product.pricing || product.price || "Contact for pricing",
                      rating: 4.0 + (Math.random() * 1.5), // Random rating between 4.0-5.5
                      popularity: Math.floor(Math.random() * 20) + 80, // Random popularity between 80-100
                      features: Array.isArray(product.features) ? product.features : [],
                      featured: product.isPopular || false,
                      isPopular: product.isPopular,
                      timeline: product.timeline,
                      timestamp: item.timestamp
                    };
                    apiProducts.push(mappedProduct);

                    // Add product category to categories set
                    if (product.category && product.category !== 'All') {
                      allCategories.add(product.category);
                    }
                  }
                });
              }
            });

            if (apiProducts.length > 0) {
              console.log("API Products mapped successfully:", apiProducts.length, "products");

              // Sort by timestamp (newest first) initially
              const sortedProducts = apiProducts.sort((a, b) => {
                const timeA = new Date(a.timestamp || 0).getTime();
                const timeB = new Date(b.timestamp || 0).getTime();
                return timeB - timeA; // Descending order
              });

              setAllProducts(sortedProducts);
              setCategories(Array.from(allCategories));
            } else {
              console.warn("No valid products found in API response");
              setAllProducts([]);
            }
          } else {
            console.warn("API returned no data or invalid structure");
            setAllProducts([]);
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
          setError("Failed to fetch products data");
          setAllProducts([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchProducts();
  }, []);

  // Filtering / Sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(q) ||
        product.companyName.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.features.some((feature: string) => feature.toLowerCase().includes(q))
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "timestamp":
          const timeA = new Date(a.timestamp || 0).getTime();
          const timeB = new Date(b.timestamp || 0).getTime();
          return timeB - timeA; // Newest first
        case "popularity":
          return b.popularity - a.popularity;
        case "rating":
          return b.rating - a.rating;
        case "company":
          return a.companyName.localeCompare(b.companyName);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [allProducts, selectedCategory, sortBy, searchQuery]);

  // Pagination helpers
  const featuredProducts = allProducts.filter((product) => product.featured);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

  // Icons helpers
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "drones":
      case "agriculture drones":
      case "survey drones":
      case "drone training & education solutions":
      case "drone manufacturing solutions":
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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "drones":
      case "drone training & education solutions":
      case "drone manufacturing solutions":
        return "bg-blue-600";
      case "sensors":
        return "bg-purple-600";
      case "accessories":
        return "bg-green-600";
      case "software":
        return "bg-indigo-600";
      case "batteries":
        return "bg-orange-500";
      case "cameras":
        return "bg-red-600";
      default:
        return "bg-gray-800";
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <LoadingScreen
        logoSrc="/images/logo.png"
        loadingText="Loading Products..."
      />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center pt-16 min-h-screen bg-yellow-400">
        <div className="text-center">
          <p className="mb-4 text-xl font-semibold text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-yellow-400 bg-black rounded-lg transition-colors hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {currentProducts.map((product, index) => {
                const IconComponent = getCategoryIcon(product.category);
                return (
                  <Link
                    to={`/product/${product.publishedId}`}
                    state={{ product }}
                    key={product.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 border-black/10 hover:border-black block"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="p-3">
                      <div className="overflow-hidden relative rounded-2xl">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover w-full h-48 transition-all duration-700 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-all duration-500 from-black/60 group-hover:opacity-100"></div>



                        <div className={`absolute top-3 right-3 ${getCategoryColor(product.category)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                          <IconComponent className="w-3 h-3" />
                          {product.category}
                        </div>

                        <div className="absolute right-3 bottom-3 px-2 py-1 text-xs font-medium text-white rounded-lg bg-black/80">
                          {product.price}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-2 text-xl font-bold text-black transition-colors duration-300 group-hover:text-yellow-600 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="mb-1 text-sm font-semibold text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {product.companyName}
                      </p>

                      {/* Added timestamp display */}
                      {product.timestamp && (
                        <p className="mb-3 text-xs text-gray-400">
                          Added: {formatDate(product.timestamp)}
                        </p>
                      )}

                      <p className="mb-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
                        <div className="flex gap-4 items-center text-xs text-gray-500">
                          <div className="flex gap-1 items-center bg-yellow-50 px-2 py-1 rounded-md">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="font-bold text-black">{product.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex gap-1 items-center">
                            <MapPin className="w-3 h-3" />
                            India
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {product.features && product.features.slice(0, 2).map((feature: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black/70 bg-gray-100 rounded-md line-clamp-1"
                          >
                            {feature}
                          </span>
                        ))}
                        {product.features && product.features.length > 2 && (
                          <span className="px-2 py-1 text-[10px] font-bold text-black/50 bg-gray-100 rounded-md">
                            +{product.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
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
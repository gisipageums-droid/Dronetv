
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';
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

      const API_URL = COMPANY_API ? `${COMPANY_API}/product/view` : `${LAMBDA.products}/product/view`;

      axios
        .get(API_URL)
        .then((response) => {
          const responseData = response.data;

          if (responseData.status && responseData.data && Array.isArray(responseData.data)) {
            const apiProducts: Product[] = [];
            const allCategories = new Set<string>(['All']);
            const seenProductCompanyIds = new Set<string>();

            responseData.data.forEach((item: ApiResponseItem) => {
              const pcid = (item.publishedId || '').trim();
              if (pcid && seenProductCompanyIds.has(pcid)) return;
              if (pcid) seenProductCompanyIds.add(pcid);
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
              const sortedProducts = apiProducts.sort((a, b) => {
                const timeA = new Date(a.timestamp || 0).getTime();
                const timeB = new Date(b.timestamp || 0).getTime();
                return timeB - timeA; // Descending order
              });

              setAllProducts(sortedProducts);
              setCategories(Array.from(allCategories));
            } else {
              setAllProducts([]);
            }
          } else {
            setAllProducts([]);
          }
        })
        .catch(() => {
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

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

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Catalog</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Products <span className="text-yellow-400">Catalog</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Explore advanced drones, sensors, and accessories for professionals.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{allProducts.length}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col gap-2 justify-between items-center lg:flex-row">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2.5 pr-3 pl-9 w-full text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2.5 w-full sm:w-44 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2.5 w-full sm:w-44 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategory !== "All" && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="text-sm hover:text-white">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="flex gap-1 items-center px-3 py-1 text-xs font-medium text-yellow-400 bg-black rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="text-sm hover:text-white">×</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
          {totalPages > 1 && <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>}
        </div>

        {currentProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="p-10 mx-auto max-w-md rounded-xl border border-gray-200 bg-white">
              <Search className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-bold text-gray-900">No products found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {currentProducts.map((product, index) => {
              const IconComponent = getCategoryIcon(product.category);
              return (
                <Link
                  to={`/product/${product.publishedId}`}
                  state={{ product }}
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 block"
                >
                  <div className="p-3">
                    <div className="overflow-hidden relative rounded-lg">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-48 transition-all duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-500 from-black/60 group-hover:opacity-100" />
                      <div className={`absolute top-3 right-3 ${getCategoryColor(product.category)} text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1`}>
                        <IconComponent className="w-3 h-3" />
                        {product.category}
                      </div>
                      <div className="absolute right-3 bottom-3 px-2 py-1 text-xs font-medium text-white rounded-lg bg-black/80">
                        {product.price}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-2 text-base font-bold text-gray-900 group-hover:text-yellow-600 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="mb-1 text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      {product.companyName}
                    </p>
                    {product.timestamp && (
                      <p className="mb-3 text-xs text-gray-400">Added: {formatDate(product.timestamp)}</p>
                    )}
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                      <div className="flex gap-1 items-center bg-gray-50 px-2 py-1 rounded-md">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <MapPin className="w-3 h-3" />
                        India
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.features && product.features.slice(0, 2).map((feature: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 rounded-md line-clamp-1">
                          {feature}
                        </span>
                      ))}
                      {product.features && product.features.length > 2 && (
                        <span className="px-2 py-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-md">
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

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${page === currentPage
                        ? "bg-black text-yellow-400 border border-black"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
/**
 * Helper utility functions for the API
 */

/**
 * Build a query object for filtering products
 * @param {Object} query - The query parameters from the request
 * @returns {Object} The query object for MongoDB
 */
const buildProductFilterQuery = (query) => {
    const filter = {};
    
    // Basic filters
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }
    
    if (query.hasVariants !== undefined) {
      filter.hasVariants = query.hasVariants === 'true';
    }
    
    // Category filter
    if (query.category) {
      filter.categories = query.category;
    }
    
    // Price range filter
    if (query.minPrice || query.maxPrice) {
      filter.basePrice = {};
      if (query.minPrice) {
        filter.basePrice.$gte = Number.parseFloat(query.minPrice);
      }
      if (query.maxPrice) {
        filter.basePrice.$lte = Number.parseFloat(query.maxPrice);
      }
    }
    
    // Brand filter
    if (query.brand) {
      filter.brand = query.brand;
    }
    
    // Collection filter
    if (query.collection) {
      filter.collections = query.collection;
    }
    
    // Tags filter
    if (query.tag) {
      filter.tags = query.tag;
    }
    
    // Search term (using MongoDB text index)
    if (query.search) {
      filter.$text = { $search: query.search };
    }
    
    // Attribute filters (for product variants)
    const attributeFilters = Object.keys(query).filter(key => key.startsWith('attr_'));
    if (attributeFilters.length > 0) {
      for (const key of attributeFilters) {
        const attrName = key.replace('attr_', '');
        filter[`attributeOptions.${attrName}`] = query[key];
      }
    }
    
    return filter;
  };
  
  /**
   * Build a sort object for MongoDB queries
   * @param {String} sortBy - The field to sort by
   * @param {String} sortOrder - The sort order (asc or desc)
   * @returns {Object} The sort object for MongoDB
   */
  const buildSortObject = (sortBy = 'createdAt', sortOrder = 'desc') => {
    const sortDir = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortObj = {};
    
    // Add sort relevance for text search
    if (sortBy === 'relevance') {
      sortObj.score = { $meta: 'textScore' };
    } else {
      sortObj[sortBy] = sortDir;
    }
    
    return sortObj;
  };
  
  /**
   * Generate pagination metadata
   * @param {Number} page - Current page number
   * @param {Number} limit - Items per page
   * @param {Number} total - Total number of items
   * @returns {Object} Pagination metadata
   */
  const generatePaginationMetadata = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  };
  
  module.exports = {
    buildProductFilterQuery,
    buildSortObject,
    generatePaginationMetadata,
  };
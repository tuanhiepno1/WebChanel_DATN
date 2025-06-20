import axiosClient from "@api/axiosClient";



export const fetchActiveProductCategories = async () => {
  try {
    const response = await axiosClient.get("/categories");
    return response.data.filter((category) => category.status === "active");
  } catch (error) {
    console.error("Lỗi khi lấy danh mục sản phẩm:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (id_category) => {
  try {
    const response = await axiosClient.get(`/products-by-category/${id_category}`);
    return response.data?.data || []; // luôn trả về mảng
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    return []; // tránh throw khi category không có sản phẩm
  }
};

export const fetchProductsBySubcategory = async (id_subcategory) => {
  try {
    const response = await axiosClient.get(`/products-by-subcategory/${id_subcategory}`);
    return response.data?.data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`Không tìm thấy sản phẩm cho danh mục con id=${id_subcategory}`);
      return []; // trả về mảng rỗng thay vì throw
    }
    console.error("Lỗi khi lấy sản phẩm theo danh mục con:", error);
    return [];
  }
};


export const fetchProductsByCategorySlug = async (slug) => {
  try {
    const categories = await fetchActiveProductCategories();

    // Tìm trong subcategories trước
    for (const cat of categories) {
      const sub = cat.subcategories?.find((sub) => sub.slug === slug);
      if (sub) {
        const rawProducts = await fetchProductsByCategory(sub.id_category);
        const products = mapProducts(rawProducts);

        return {
          products,
          category: {
            category_name: sub.category_name,
            subcategories: cat.subcategories || [],
          },
        };
      }
    }

    // Nếu không khớp danh mục con, tìm trong danh mục cha
    const matchedParent = categories.find((cat) => cat.slug === slug);
    if (matchedParent) {
      const subIds = matchedParent.subcategories?.map((sub) => sub.id_subcategory) || [];

      const productResults = await Promise.all(
        subIds.map(async (id) => {
          try {
            const items = await fetchProductsBySubcategory(id);
            return mapProducts(items);
          } catch (error) {
            console.warn(`Không lấy được sản phẩm cho subcategory id=${id}`);
            return [];
          }
        })
      );

      const allProducts = productResults.flat();

      return {
        products: allProducts,
        category: {
          category_name: matchedParent.category_name,
          subcategories: matchedParent.subcategories || [],
        },
      };
    }

    throw new Error(`Không tìm thấy danh mục hoặc danh mục con với slug = ${slug}`);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo slug:", error);
    throw error;
  }
};

// Tiện ích định dạng sản phẩm
export const mapProducts = (items) =>
  (items || []).map((item) => ({
    id: item.id_product,
    name: item.name,
    image: item.image,
    slug: getSlugFromCategory(item.id_category),
    price: `${item.price.toLocaleString()}₫`,
    rating: item.rating || 0,
    type: item.type || null, 
    volume: item.volume || null, 
    gender: item.gender || null, 
  }));

// Hàm phụ (tuỳ bạn xử lý sao cho đúng slug tương ứng id_category)
const getSlugFromCategory = (id_category) => {
  const map = {
    1: "nuoc-hoa",
    2: "mat-kinh",
    3: "dong-ho",
    4: "trang-diem",
  };
  return map[id_category] || "san-pham";
};


export const fetchProductById = async (id_product) => {
  const response = await axiosClient.get(`/products/${id_product}`);
  return response.data?.data;
};

export const mapProductDetail = (item) => ({
  id: item.id_product,
  categoryId: item.id_category,
  name: item.name,
  image: item.image,
  price: item.price,
  rating: item.rating || 0,
  gender: item.gender,
  volume: item.volume,
  type: item.type,
  quantity: item.quantity,
  views: item.views,
  discount: item.discount,
  description: item.description,
  note: item.note,
  status: item.status,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});



export const fetchFeaturedProducts = async () => {
  try {
    const response = await axiosClient.get("/featured-products");

    // Kiểm tra nếu dữ liệu đúng là mảng
    const products = Array.isArray(response.data.data)
      ? response.data.data
      : [];

    return products.slice(0, 10); // Lấy 10 sản phẩm đầu tiên
  } catch (error) {
    console.error("Lỗi khi fetch featured products:", error);
    return [];
  }
};

export const fetchNewProducts = async () => {
  try {
    const response = await axiosClient.get("/new-products");
    return response.data.slice(0, 10);
  } catch (error) {
    console.error("Lỗi khi fetch new products:", error);
    return [];
  }
};

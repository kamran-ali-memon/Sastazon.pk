import productModel from '../Models/ProductModel.js';
import { uploadMultipleToCloudinary } from '../Utils/cloudinary.js';

// This helper gathers all product image URLs.
// If new files are uploaded, it uploads them to Cloudinary first.
// If there are already product image URLs in the request, those stay too.
const buildProductImageUrls = async (req) => {
  // Get uploaded files from Multer
  const uploadedFiles = req.files || [];

  // Upload new files to Cloudinary and get their URLs
  const uploadedUrls = uploadedFiles.length > 0 ? await uploadMultipleToCloudinary(uploadedFiles) : [];

  // If frontend sends old URLs too, keep them
  const requestImages = req.body.productImages;
  let existingImages = [];

  if (Array.isArray(requestImages)) {
    existingImages = requestImages;
  } else if (typeof requestImages === 'string' && requestImages.trim() !== '') {
    existingImages = [requestImages];
  }

  // Final list = new uploaded URLs + old URLs
  return [...uploadedUrls, ...existingImages];
};

// Add new product
export const addProducts = async (req, res) => {
  const { productname, productSlug, productDesc, productPrice, productStock, productCategory } = req.body;

  try {
    // Check required fields
    if (!productname || !productSlug || !productDesc || !productPrice || !productStock || !productCategory) {
      return res.status(400).send({
        status: false,
        message: 'All Input Fields Are Required to Fill',
      });
    }

    // Upload image files and prepare image URL array
    const productImages = await buildProductImageUrls(req);

    // Prevent duplicate product names
    const isProductAlreadyExist = await productModel.findOne({
      productname: { $regex: new RegExp(`^${productname}$`, 'i') },
    });

    if (isProductAlreadyExist) {
      return res.status(400).send({
        status: false,
        message: 'Product Already Exist',
      });
    }

    // Save product data into MongoDB
    const product = await productModel.create({
      productname,
      productSlug,
      productDesc,
      productPrice,
      productStock,
      productCategory,
      productImages,
    });

    if (product) {
      return res.status(200).send({
        status: true,
        message: 'Product Add Successfully.',
        product,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Server Error: ' + error.message,
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {

        // Normal request: saare products return karo
        // Home aur admin ki existing requests ke liye
        if (req.query.paginate !== 'true') {

            const allProducts = await productModel.find()

            return res.status(200).send({
                status: true,
                allProducts
            })

        }

        // Pagination sirf customer Products page ke liye
        const page = Number(req.query.page) || 1
        const limit = 20

        const search = req.query.search || ''
        const category = req.query.category || 'All'
        const sort = req.query.sort || 'default'

        let filter = {}

        // Search in name, description and category
        const searchWords = search.trim().split(/\s+/).filter(Boolean)

        if (searchWords.length > 0 && search.trim()) {

            filter.$and = searchWords.map((word) => {

                const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

                return {
                    $or: [
                        { productname: { $regex: safeWord, $options: 'i' } },
                        { productDesc: { $regex: safeWord, $options: 'i' } },
                        { productCategory: { $regex: safeWord, $options: 'i' } }
                    ]
                }

            })

        }

        // Category filter
        if (category !== 'All') {
            filter.productCategory = category
        }

        // Sorting
        let sortOption = {}

        if (sort === 'low') {
            sortOption.productPrice = 1
        } else if (sort === 'high') {
            sortOption.productPrice = -1
        } else if (sort === 'name') {
            sortOption.productname = 1
        }

        // Total matching products
        const totalProducts = await productModel.countDocuments(filter)

        // Get only 20 products for the selected page
        const allProducts = await productModel
            .find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)

        // Get all available categories
        const categories = await productModel.distinct('productCategory')

        return res.status(200).send({
            status: true,
            allProducts,
            categories,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts
            }
        })

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: error.message
        })

    }
}


// Get single product by ID
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(403).send({
        status: false,
        message: 'Product Couldn\'t Found.',
      });
    }

    return res.status(200).send({
      status: true,
      message: 'Fetched product.',
      product,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Server Error: ' + error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findOneAndDelete({ _id: productId });

    if (!product) {
      return res.status(403).send({
        status: false,
        message: 'Product Couldn\'t Found.',
      });
    }

    return res.status(200).send({
      status: true,
      message: 'Product Deleted.',
      product,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Server Error: ' + error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productname, productSlug, productDesc, productPrice, productStock, productCategory } = req.body;

    // Only include fields that were sent by the frontend
    const updateData = {
  ...(productname !== undefined && { productname }),
  ...(productSlug !== undefined && { productSlug }),
  ...(productDesc !== undefined && { productDesc }),
  ...(productPrice !== undefined && { productPrice }),
  ...(productStock !== undefined && { productStock }),
  ...(productCategory !== undefined && { productCategory }),
};

    // If new images are uploaded, replace the product image array
    if (req.files && req.files.length > 0) {
      updateData.productImages = await buildProductImageUrls(req);
    }

    const product = await productModel.findByIdAndUpdate(productId, updateData, { new: true });

    if (!product) {
      return res.status(403).send({
        status: false,
        message: 'Product Couldn\'t Found.',
      });
    }

    return res.status(200).send({
      status: true,
      message: 'Product Updated.',
      product,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Server Error: ' + error.message,
    });
  }
};

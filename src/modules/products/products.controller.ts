import { Request, Response } from 'express';
import Product, { ReviewDocument, ReviewModel } from './products.model';
import { ProductDocument } from './products.types';
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';
import mongoose, { ObjectId } from 'mongoose';
import { Types } from 'mongoose';

//Technical debts
// - Image handling with multer?
// - Possible pagination?
// - Possible refactor to remove reviews controller from products
// - Pagination for reviews
// - Use numbers for roles instead of strings

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, color, frameMaterial, lensMaterial, category } = req.query;

    const searchCriteria: Record<string, any> = {};
    if (title) searchCriteria.title = new RegExp(title as string, 'i');
    if (color) searchCriteria.color = color;
    if (frameMaterial) searchCriteria.frameMaterial = frameMaterial;
    if (lensMaterial) searchCriteria.lensMaterial = lensMaterial;
    if (category) searchCriteria.category = category;

    const ViewProducts = await Product.find(searchCriteria)
      .sort({ createdAt: -1 })
      .populate({
        path: 'reviews.user',
        select: '-password -publicKey',
      })
      .exec();

    if (ViewProducts.length < 1) {
      res
        .status(HttpResponseCodes.OK)
        .send('There are no products matching the search criteria.');
    } else {
      res.status(HttpResponseCodes.OK).json({
        'Number of Products': ViewProducts.length,
        products: ViewProducts,
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const getSingleProduct = async (
  req: Request,
  res: Response
): Promise<void | ProductDocument> => {
  try {
    const productId = req.params.id;

    if (!productId) {
      res.status(HttpResponseCodes.BAD_REQUEST).json('Product ID is required');
      return;
    }

    const product: ProductDocument | null = await Product.findById(productId)
      .populate({
        path: 'reviews.user',
        select: '-password -publicKey',
      })
      .exec();

    if (!product) {
      res.status(HttpResponseCodes.NOT_FOUND).json('Product not found');
      return;
    }

    res.status(HttpResponseCodes.OK).json(product as ProductDocument);
    return product as ProductDocument;
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<ProductDocument | void> => {
  try {
    // const { userId } = req.user;
    const { title, price, description, category } = req.body;
    // || !req.file
    if (!title || !price || !description || !category) {
      throw new Error('Required fields must not be empty');
    }

    const createdProduct: ProductDocument = new Product({ ...req.body });

    const newProduct: ProductDocument = await createdProduct.save();
    res.status(HttpResponseCodes.CREATED).json(newProduct);
    return newProduct;
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void | ProductDocument> => {
  try {
    const productId = req.params.id;

    if (!productId) {
      res.status(HttpResponseCodes.BAD_REQUEST).json('Product ID is required');
      return;
    }

    const updatedProduct: ProductDocument | null =
      await Product.findByIdAndUpdate(
        productId,
        { $set: req.body },
        { new: true }
      ).exec();

    if (!updatedProduct) {
      res.status(HttpResponseCodes.NOT_FOUND).json('Product not found');
      return;
    }

    res.status(HttpResponseCodes.OK).json(updatedProduct);
    return updatedProduct;
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.id;

    if (!productId) {
      res.status(HttpResponseCodes.BAD_REQUEST).json('Product ID is required');
      return;
    }

    const deletedProduct: ProductDocument | null =
      await Product.findByIdAndDelete(productId).exec();

    if (!deletedProduct) {
      res.status(HttpResponseCodes.NOT_FOUND).json('Product not found');
      return;
    }
    res.status(HttpResponseCodes.OK).json('Product deleted successfully');
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

// reviews controllers

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId;
    const { rating, comment } = req.body;
    const userId = req.user?.userId;

    if (!productId || !rating || !comment || !userId) {
      res
        .status(HttpResponseCodes.BAD_REQUEST)
        .json('Product ID, rating, comment, and user ID are required');
      return;
    }

    const product = await Product.findById(productId).exec();

    if (!product) {
      res.status(HttpResponseCodes.NOT_FOUND).json('Product not found');
      return;
    }

    const existingReview = product.reviews?.find(
      (review) => review.user?.toString() === userId.toString()
    );

    if (existingReview) {
      res
        .status(HttpResponseCodes.BAD_REQUEST)
        .json('You have already submitted a review for this product');
      return;
    }

    const userObjectId = new Types.ObjectId(userId);

    const newReview = await ReviewModel.create({
      user: userObjectId,
      rating: parseFloat(rating),
      comment,
    });

    if (
      newReview.rating === undefined ||
      newReview.rating < 0 ||
      newReview.rating > 5
    ) {
      res
        .status(HttpResponseCodes.BAD_REQUEST)
        .json('Rating must be between 0 and 5');
      return;
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    product.reviews.push(newReview);

    product.totalRatings = product.reviews.length;
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    product.averageRating = totalRating / product.totalRatings;

    await product.save();

    res.status(HttpResponseCodes.CREATED).json({
      message: 'Review added successfully',
      totalRatings: product.totalRatings,
      averageRating: product.averageRating,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const updateReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;
    const userId = req.user?.userId;

    if (!productId || !reviewId || (!rating && !comment) || !userId) {
      res
        .status(HttpResponseCodes.BAD_REQUEST)
        .json(
          'Product ID, review ID, and either rating, comment, or both, and user ID are required'
        );
      return;
    }

    const product = await Product.findById(productId).exec();

    if (!product) {
      res.status(HttpResponseCodes.NOT_FOUND).json('Product not found');
      return;
    }

    if (!product.reviews) {
      res
        .status(HttpResponseCodes.NOT_FOUND)
        .json('No reviews found for the product');
      return;
    }

    const existingReviewIndex = product.reviews.findIndex(
      (review) =>
        review.user?.toString() === userId.toString() &&
        review._id.toString() === reviewId
    );

    if (existingReviewIndex === -1) {
      res
        .status(HttpResponseCodes.NOT_FOUND)
        .json(
          'Review not found or you do not have permission to update this review'
        );
      return;
    }

    const updatedReview = product.reviews[existingReviewIndex];

    if (rating !== undefined) {
      updatedReview.rating = parseFloat(rating);
    }

    if (comment !== undefined) {
      updatedReview.comment = comment;
    }

    if (
      (rating !== undefined &&
        (updatedReview.rating === undefined ||
          updatedReview.rating < 0 ||
          updatedReview.rating > 5)) ||
      (comment !== undefined && updatedReview.comment === undefined)
    ) {
      res
        .status(HttpResponseCodes.BAD_REQUEST)
        .json('Invalid rating or comment');
      return;
    }

    await product.save();

    const totalRating = product.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    product.totalRatings = product.reviews.length;
    product.averageRating = totalRating / product.totalRatings;

    await product.save();

    res.status(HttpResponseCodes.OK).json({
      message: 'Review updated successfully',
      totalRatings: product.totalRatings,
      averageRating: product.averageRating,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const reviewId = req.params.reviewId;
    const userId = req.user?.userId;

    if (!productId || !reviewId || !userId) {
      res
        .status(HttpResponseCodes.BAD_REQUEST)
        .json('Product ID, Review ID, and User ID are required');
      return;
    }

    const product = await Product.findById(productId).exec();

    if (!product) {
      res.status(HttpResponseCodes.NOT_FOUND).json('Product not found');
      return;
    }

    const existingReviewIndex = product.reviews?.findIndex(
      (review) =>
        review.user?.toString() === userId.toString() &&
        review._id.toString() === reviewId
    );

    if (existingReviewIndex !== undefined && existingReviewIndex !== -1) {
      if (product.reviews) {
        const deletedReviews = product.reviews.splice(existingReviewIndex, 1);

        if (deletedReviews.length > 0) {
          if (product.reviews.length === 0) {
            product.totalRatings = 0;
            product.averageRating = 0;
          } else {
            const totalRating = product.reviews.reduce(
              (sum, review) => sum + (review.rating || 0),
              0
            );
            product.totalRatings = product.reviews.length;
            product.averageRating = totalRating / product.totalRatings;
          }

          await product.save();

          res.status(HttpResponseCodes.OK).json({
            message: 'Review deleted successfully',
            totalRatings: product.totalRatings,
            averageRating: product.averageRating,
          });
        } else {
          res.status(HttpResponseCodes.NOT_FOUND).json('Review not found');
        }
      } else {
        res
          .status(HttpResponseCodes.NOT_FOUND)
          .json('Product reviews are undefined');
      }
    } else {
      res
        .status(HttpResponseCodes.NOT_FOUND)
        .json(
          'Review not found or you do not have permission to delete this review'
        );
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

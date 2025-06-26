import type { AddCartRequest, Book, Product, Review } from "../types";
import { axiosInstance } from "../../../lib/axiosInstance";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import BookInfo from "../components/BookInfo";
import ProductNotFound from "../components/ProductNotFound";
import ReviewInfo from "../components/ReviewInfo";
import { toast } from "sonner";
import { PRODUCT_CATEGORY } from "../../../types/constants";
import { fetchBookReviews, fetchPcReviews } from "../api/reviewApi";
import type { RawBook } from "../types";
import RecommendedByContentBaseProducts from "../components/RecommendedByContentBaseProducts";
import { attachReviewsToProducts } from "../hooks/useProductData";
import { convertToProduct } from "../utils/productConverter";
import { userAtom } from "../../../stores/userAtom";
import { useAtomValue } from "jotai";
import RecommendedByUserBaseProducts from "../components/RecommendedByUserBaseProducts";
import type { ProductWithType } from "../pc/PcDetail";

export default function BookDetail() {
  const [book, setBook] = useState<Book>();
  const [contentBasedBooks, setContentBasedBooks] = useState<Product[]>([]);
  const [userBaseProducts, setUserBaseProducts] = useState<ProductWithType[]>(
    [],
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAtomValue(userAtom);

  const { itemId } = useParams({ from: "/product/book/$itemId/" });
  const navigate = useNavigate();

  /**
   * この商品全体のレビューの総数
   */
  const totalReviews = reviews.length;

  /**
   * この商品全体のレビューの平均評価
   */
  const average =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  /**
   * カートに本を追加する
   *
   * @param quantity カートに追加する数量
   */
  const handleClick = async (quantity: number) => {
    if (!book?.bookId) {
      return;
    }

    const addCartRequestBody: AddCartRequest = {
      productId: book?.bookId,
      productCategory: PRODUCT_CATEGORY.BOOK,
      quantity: quantity,
    };

    try {
      await axiosInstance.post("/carts", addCartRequestBody);
      toast.success(`${book?.name}を${quantity}個カートに追加しました`);
      navigate({ to: "/cart" });
    } catch (error) {
      toast.error("カートへの追加に失敗しました");
    }
  };

  /**
   * 本の詳細情報を取得する
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const bookDetailResponse = await axiosInstance.get(`/books/${itemId}`);
      setBook(bookDetailResponse.data);
      const contentBaseBooksResponse = await axiosInstance.get(
        `/books/recommend/contentBase/${itemId}`,
      );
      console.log(contentBaseBooksResponse.data);
      const contentBaseRawBooks: RawBook[] = contentBaseBooksResponse.data;
      const contentBaseProducts: Product[] = await attachReviewsToProducts(
        contentBaseRawBooks.map((rawBook: RawBook) =>
          convertToProduct(rawBook),
        ),
        fetchBookReviews,
      );
      setContentBasedBooks(contentBaseProducts);
      if (user) {
        const UserBaseProductsResponse = await axiosInstance.get(
          `/books/recommend/userBase/${user.userId}`,
        );
        for (const product of UserBaseProductsResponse.data) {
          if (product.productCategory === 0) {
            const productDetailResponse = await axiosInstance.get(
              `/pcs/${product.productId}`,
            );
            const reviews = await fetchPcReviews(product.productId);
            const totalReviews = reviews.length;
            const average =
              totalReviews > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                  totalReviews
                : 0;

            const productWithType: ProductWithType = {
              id: productDetailResponse.data.pcId,
              name: productDetailResponse.data.name,
              price: productDetailResponse.data.price,
              image: productDetailResponse.data.imageUrl,
              reviewCount: totalReviews,
              averageRating: average,
              type: "pc",
            };
            setUserBaseProducts((prev) => {
              if (
                prev.find(
                  (p) =>
                    p.id === productWithType.id &&
                    p.type === productWithType.type,
                )
              ) {
                return prev; // 重複は無視
              }
              return [...prev, productWithType];
            });
          } else {
            const productDetailResponse = await axiosInstance.get(
              `/books/${product.productId}`,
            );
            const reviews = await fetchBookReviews(product.productId);
            const totalReviews = reviews.length;
            const average =
              totalReviews > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                  totalReviews
                : 0;

            const productWithType: ProductWithType = {
              id: productDetailResponse.data.bookId,
              name: productDetailResponse.data.name,
              price: productDetailResponse.data.price,
              image: productDetailResponse.data.imageUrl,
              reviewCount: totalReviews,
              averageRating: average,
              type: "book",
            };
            setUserBaseProducts((prev) => {
              if (
                prev.find(
                  (p) =>
                    p.id === productWithType.id &&
                    p.type === productWithType.type,
                )
              ) {
                return prev; // 重複は無視
              }
              return [...prev, productWithType];
            });
          }
        }
      }
    } catch (error) {
      toast.error("商品情報の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [itemId, user]);

  /**
   * 本のレビューを取得する
   */
  const fetchReviews = useCallback(async () => {
    if (!itemId) return;

    try {
      const reviewsData = await fetchBookReviews(itemId);
      setReviews(reviewsData);
    } catch (error) {
      toast.error("レビューの取得に失敗しました");
    }
  }, [itemId]);

  /**
   * レビュー投稿後、レビュー一覧を更新する
   */
  const handleReviewPosted = () => {
    fetchReviews();
  };

  useEffect(() => {
    fetchData();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [fetchData, fetchReviews]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 py-8">
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          {book ? (
            <>
              <div className="w-full max-w-7xl">
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="col-span-2">
                    <BookInfo
                      book={book}
                      handleClick={handleClick}
                      average={average}
                      totalReviews={totalReviews}
                    />
                  </div>
                  <RecommendedByUserBaseProducts products={userBaseProducts} />
                </div>
              </div>
              <RecommendedByContentBaseProducts
                products={contentBasedBooks}
                type="book"
              />
              <ReviewInfo
                reviews={reviews}
                totalReviews={totalReviews}
                average={average}
                productId={book.bookId}
                productCategory={PRODUCT_CATEGORY.BOOK}
                onReviewPosted={handleReviewPosted}
              />
            </>
          ) : (
            <ProductNotFound />
          )}
        </>
      )}
    </div>
  );
}

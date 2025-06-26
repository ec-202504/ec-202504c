import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axiosInstance";
import { toast } from "sonner";
import { PRODUCT_CATEGORY } from "../../../types/constants";
import type { AddCartRequest, Pc, Product, RawPc, Review } from "../types";
import { fetchPcReviews } from "../api/reviewApi";

import PcInfo from "../components/PcInfo";
import LoadingOverlay from "../components/LoadingOverlay";
import ProductNotFound from "../components/ProductNotFound";
import ReviewInfo from "../components/ReviewInfo";
import RecommendedByContentBaseProducts from "../components/RecommendedByContentBaseProducts";
import { attachReviewsToProducts } from "../hooks/useProductData";
import { convertToProduct } from "../utils/productConverter";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../stores/userAtom";
import RecommendedByUserBaseProducts from "../components/RecommendedByUserBaseProducts";

export default function PcDetail() {
  const [pc, setPc] = useState<Pc>();
  const [contentBasedPcs, setContentBasedPcs] = useState<Product[]>([]);
  const [userBasePcs, setUserBasePcs] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAtomValue(userAtom);

  const { itemId } = useParams({ from: "/product/pc/$itemId/" });
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
   * カートにPCを追加する
   *
   * @param quantity カートに追加する数量
   */
  const handleClick = async (quantity: number) => {
    if (!pc?.pcId) {
      return;
    }

    const addCartRequestBody: AddCartRequest = {
      productId: pc?.pcId,
      productCategory: PRODUCT_CATEGORY.PC,
      quantity: quantity,
    };

    try {
      await axiosInstance.post("/carts", addCartRequestBody);
      toast.success(`${pc?.name}を${quantity}個カートに追加しました`);
      navigate({ to: "/cart" });
    } catch {
      toast.error("カートへの追加に失敗しました");
    }
  };

  /**
   * PCの詳細情報を取得する
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const pcDetailResponse = await axiosInstance.get(`/pcs/${itemId}`);
      setPc(pcDetailResponse.data);
      const contentBasePcsResponse = await axiosInstance.get(
        `/pcs/recommend/contentBase/${itemId}`,
      );
      const contentBaseRawPcs: RawPc[] = contentBasePcsResponse.data;
      const contentBasePcs: Product[] = await attachReviewsToProducts(
        contentBaseRawPcs.map((rawPc: RawPc) => convertToProduct(rawPc)),
        fetchPcReviews,
      );
      setContentBasedPcs(contentBasePcs);
      if (user) {
        const UserBaseRowPcsResponse = await axiosInstance.get(
          `/pcs/recommend/userBase/${user.userId}`,
        );
        const userBaseRawPcs: RawPc[] = UserBaseRowPcsResponse.data;
        const userBasePcs: Product[] = await attachReviewsToProducts(
          userBaseRawPcs.map((rawPc: RawPc) => convertToProduct(rawPc)),
          fetchPcReviews,
        );
        setUserBasePcs(userBasePcs);
      }
    } catch {
      toast.error("商品情報の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [itemId, user]);

  /**
   * PCのレビューを取得する
   */
  const fetchReviews = useCallback(async () => {
    if (!itemId) return;

    try {
      const reviewsData = await fetchPcReviews(itemId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("レビューの取得に失敗しました:", error);
      toast.error("レビューの取得に失敗しました");
    }
  }, [itemId]);

  useEffect(() => {
    fetchData();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [fetchData, fetchReviews]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 py-4">
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          {pc ? (
            <>
              <div className="w-full max-w-7xl">
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="grid col-span-2">
                    <PcInfo
                      pc={pc}
                      handleClick={handleClick}
                      average={average}
                      totalReviews={totalReviews}
                    />
                  </div>
                  <RecommendedByUserBaseProducts products={userBasePcs} />
                </div>
              </div>
              <RecommendedByContentBaseProducts products={contentBasedPcs} />
              <ReviewInfo
                reviews={reviews}
                totalReviews={totalReviews}
                average={average}
                productId={pc.pcId}
                productCategory={PRODUCT_CATEGORY.PC}
                onReviewPosted={fetchReviews}
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

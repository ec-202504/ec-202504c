import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import { postBookReview, postPcReview } from "../api/reviewApi";
import { reviewFormSchema, type ReviewFormData } from "../schema/reviewSchema";
import { PRODUCT_CATEGORY } from "../../../types/constants";

type ReviewFormProps = {
  productId: number;
  productCategory: number;
  onReviewPosted: () => void;
  onCancel: () => void;
};

function ReviewForm({
  productId,
  productCategory,
  onReviewPosted,
  onCancel,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const rating = watch("rating");

  /**
   * レビューを投稿する
   */
  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);

    try {
      if (productCategory === PRODUCT_CATEGORY.PC) {
        await postPcReview(productId, data);
      } else {
        await postBookReview(productId, data);
      }

      toast.success("レビューを投稿しました");
      reset();
      onReviewPosted();
    } catch (error) {
      toast.error("レビューの投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>レビューを投稿</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">評価</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <Button
                    key={starValue}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setValue("rating", starValue)}
                    className={`text-2xl p-0 h-auto ${
                      starValue <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </Button>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                {rating > 0 ? `${rating}つ星` : "評価を選択してください"}
              </p>

              {errors.rating && (
                <p className="text-sm text-destructive">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">コメント</Label>
              <Textarea
                id="comment"
                {...register("comment")}
                placeholder="商品についての感想を書いてください"
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                {watch("comment")?.length || 0}/255文字
              </p>
              {errors.comment && (
                <p className="text-sm text-destructive">
                  {errors.comment.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "投稿中..." : "投稿する"}
              </Button>

              <Button type="button" variant="outline" onClick={onCancel}>
                キャンセル
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReviewForm;

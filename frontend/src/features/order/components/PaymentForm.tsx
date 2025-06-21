import {
  useStripe,
  PaymentElement,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "../../../components/ui/button";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setResult(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {}, // return_url は不要（リダイレクトさせない）
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "エラーが発生しました");
    } else if (paymentIntent?.status === "requires_capture") {
      setResult("✅ カードは有効です（ホールド完了）");
    } else {
      setResult(`⚠️ 支払いステータス: ${paymentIntent?.status}`);
    }

    setIsProcessing(false);
  };

  return (
    <div className="mt-4">
      <PaymentElement />

      <div className="text-right">
        <Button
          variant="default"
          type="submit"
          disabled={!stripe || isProcessing}
          className="mt-4"
          onClick={handleSubmit}
        >
          {isProcessing ? "確認中..." : "カードの有効性を確認"}
        </Button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {result && <p>{result}</p>}
    </div>
  );
}

export default PaymentForm;

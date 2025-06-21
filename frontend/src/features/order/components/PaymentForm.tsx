import {
  useStripe,
  PaymentElement,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
      setResult("カードは有効です");
    } else {
      setResult(`支払いステータス: ${paymentIntent?.status}`);
    }

    setIsProcessing(false);
  };

  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle className="text-lg">クレジットカード情報</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {result && (
          <Alert
            variant="default"
            className="border-green-200 bg-green-50 text-green-800"
          >
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {result}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert
            variant="default"
            className="border-red-200 bg-red-50 text-red-800"
          >
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <PaymentElement />

        <div className="flex justify-end">
          <Button
            variant="default"
            type="submit"
            disabled={!stripe || isProcessing}
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                確認中...
              </>
            ) : (
              "カードの有効性を確認"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentForm;

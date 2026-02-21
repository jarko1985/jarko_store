"use client";

import { FC } from "react";
import PaypalWrapper from "../cards/payment/paypal/paypal-wrapper";
import StripeWrapper from "../cards/payment/stripe/stripe-wrapper";
import PaypalPayment from "../cards/payment/paypal/paypal-payment";
import StripePayment from "../cards/payment/stripe/stripe-payment";

interface Props {
  orderId: string;
  amount: number;
}

const OrderPayment: FC<Props> = ({ amount, orderId }) => {
  return (
    <div className="h-full flex flex-col space-y-5">
      {/* Paypal */}
      <PaypalWrapper>
        <PaypalPayment orderId={orderId} />
      </PaypalWrapper>
      {/* Stripe */}
      <StripeWrapper amount={amount}>
        <StripePayment orderId={orderId} />
      </StripeWrapper>
    </div>
  );
};

export default OrderPayment;

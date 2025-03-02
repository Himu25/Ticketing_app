"use client";
import { Elements } from "@stripe/react-stripe-js";
import React from "react";
import Order from "./Order";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51PNDUWHG4k8ISmCRBxE06RdkphHIlgRK1S22pkDhWOYOfpbPz1W7xRQDgYG78dlApdLtQA0lTCaWSKOnsBOtRiXJ00oG4S3XCi"
);
export default function OrderDetails({ order }) {
  return (
    <Elements stripe={stripePromise}>
      <Order order={order} />
    </Elements>
  );
}

"use client";
import React, { useState } from "react";
import useRequest from "@/Hooks/useRequest";
import toast from "react-hot-toast";
import InputBox from "./InputBox";
import Buttons from "./Buttons";
import Errors from "./Errors";

const SellTicketForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors, loading } = useRequest({
    url: "/api/tickets/",
    method: "post",
    body: { title, price },
    onSuccess: (ticket) => {
      toast.success("Ticket sold successfully!");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sell Your Ticket
        </h2>

        {errors && <Errors errors={errors} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputBox
            name="title"
            label="Ticket Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter the title of the ticket"
          />

          <InputBox
            name="price"
            label="Ticket Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter the price of the ticket"
          />

          <div className="text-center">
            <Buttons
              label="Sell Now"
              loading={loading}
              className="w-full py-3 text-white font-semibold bg-indigo-600 border border-indigo-600 rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-700 hover:border-indigo-700 focus:ring focus:ring-indigo-300"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellTicketForm;

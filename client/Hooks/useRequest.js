import axios from "axios";
import { useState } from "react";

export default function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const doRequest = async () => {
    setLoading(true);
    setErrors(null);

    try {
      const response =
        method.toLowerCase() === "get" || method.toLowerCase() === "delete"
          ? await axios.get(url)
          : await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      setErrors(error.response?.data?.errors || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { doRequest, errors, loading };
}

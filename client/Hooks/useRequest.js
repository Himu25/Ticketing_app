import axios from "axios";
import { useState } from "react";

export default function useRequest({ url, method, body, onSuccess }) {
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const doRequest = async () => {
        setLoading(true);
        setErrors(null)
        try {
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.body);
            }
        } catch (error) {
            setErrors(error.response.data.errors);
        } finally {
            setLoading(false);
        }
    };
    return { doRequest, errors, loading };
}

import axios from "axios";
import { cookies, headers } from 'next/headers';

export const buildClient = () => {
    const headersList = headers();
    const host = headersList.get('host');
    const cookieStore = cookies();
    const session = cookieStore.get('session')?.value;

    return axios.create({
        baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: {
            "Host": host,
            "Cookie": `session=${session}`
        }
    });
};

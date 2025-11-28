import api from "./axiosInstance";

export const sendOtp = (input) => {
    const isEmail = input.includes("@");

    return api.post("/auth/request-otp",
        isEmail
            ? { email: input }
            : { phone: input }
    );
};

export const verifyOtp = (input, otp) => {
    const isEmail = input.includes("@");

    return api.post("/auth/verify-otp",
        isEmail
            ? { email: input, otp }
            : { phone: input, otp }
    );
};


// Update User Data
export const updateUser = (userId, data) => {
    return api.put(`/update-user/${userId}`, data);
};
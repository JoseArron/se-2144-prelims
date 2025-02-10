import axios from "axios";

type SendSmsResponse = {
  status: "success" | "error";
  data?: string;
  message?: string;
};

export async function sendSms(): Promise<SendSmsResponse> {
  try {
    const response = await axios.post<SendSmsResponse>(
      import.meta.env.VITE_SMS_API_URL,
      {
        recipient: import.meta.env.VITE_CELLPHONE_NUMS,
        sender_id: "PhilSMS",
        type: "plain",
        message: "this is a test message from the pixel calculator. hello, kumusta, hola, ni hao ",
      },
      {
        headers: {
        Authorization: "Bearer " + import.meta.env.VITE_SMS_API_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to send SMS",
    };
  }
}
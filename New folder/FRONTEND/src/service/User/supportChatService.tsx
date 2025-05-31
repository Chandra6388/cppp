import axios from "axios"
import * as Config from "../../../Utils/config";

export async function generateAIResponse(message: string, userContext: any): Promise<string> {
    try {
        const response = await axios.post(`${Config.base_url}supportChat`, {
            message,
            userContext,
        });

        return response.data.reply;
    } catch (error) {
        console.error("Error getting AI response:", error);
        return "Sorry, support is currently unavailable.";
    }
}

export const createSupportTicket = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}createSupportTicket`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const getChatMessage = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getChatMessage`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const getAllSupportTicket = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllSupportTicket`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
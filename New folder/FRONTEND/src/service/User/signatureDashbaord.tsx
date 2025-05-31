import axios from "axios"
import * as Config from "../../../Utils/config";

export const dashboardSummary = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}dashboardSummary`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
export const btnClickedGraphData = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}btnClickedGraphData`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const audienceOverviewGraphData = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}audienceOverviewGraphData`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const signatureSendGraphData = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}signatureSendGraphData`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const sigantureUseAnalytics = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}sigantureUseAnalytics`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
export const viewOpratingSystem = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}viewOpratingSystem`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const signatureCreatedAnalytics = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}signatureCreatedAnalytics`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
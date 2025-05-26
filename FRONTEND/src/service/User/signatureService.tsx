import axios from "axios"
import * as Config from "../../../Utils/config";

export const AddSignature = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}AddSignature`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const updateSignature = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}updateSignature`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const getAllSignatures = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllSignature`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const deleteSignature = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}deleteSignature`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}


export const getAllTemplates = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllTemplates`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
export const getSignatureById = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getSignatureById`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const signatureSendByMails = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}signatureSendByMails`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

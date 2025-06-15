import axios from "axios"
import * as Config from "../Utils/config";

export const getBlogs = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getBlogs`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
 
export const getBlogById = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getBlogById`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const getTopReatedBlog = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}getTopReatedBlog`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
 
export const addContactUs = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}addContactUs`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
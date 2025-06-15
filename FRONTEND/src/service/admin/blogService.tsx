import axios from "axios"
import * as Config from "../../../Utils/config";

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

export const addBlogs = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}addBlogs`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const updateBlog = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}updateBlog`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
export const deleteBlog = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}deleteBlog`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}
 
 
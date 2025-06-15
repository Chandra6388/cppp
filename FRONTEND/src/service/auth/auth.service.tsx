import axios from "axios"
import * as Config from "../../../Utils/config"; 

export const UserLogin = async (data: any) => {
    try {
        const res = await axios.post(`${Config.base_url}login`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const UserRegister = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}register`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const updateUser = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}updateUser`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}


export const getAllUser = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllUser`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const updateProfileImg = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}updateProfileImg`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const getUserById = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}getUserById`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const forgotPassword = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}forgotPassword`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const googleLogin = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}googleLogin`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const resetPassword = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}resetPassword`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const updateUserStatus = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}updateUserStatus`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const deleteUserByAdmin = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}deleteUserByAdmin`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const getAllEmployee = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}getAllEmployee`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const userCreateAnalytics = async (data : any) => {
    try {
        const res = await axios.post(`${Config.base_url}userCreateAnalytics`, data )
        return res?.data
    }
    catch (err) {
        return err
    }
}

export const uploadImg = async ({ file }: { file: Blob | File | string }) => {
    const formData = new FormData();
    let blob: Blob;
  
    if (!file) throw new Error("No file provided");
   
    if (typeof file === 'string') {
      const base64ToBlob = (base64String: string): Blob => {
        const parts = base64String.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const byteString = atob(parts[1]);
  
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
  
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
  
        return new Blob([intArray], { type: mime });
      };
  
      blob = base64ToBlob(file);
    } else {
      // ✅ file is already Blob or File
      blob = file;
    }
  
    formData.append('image', blob, 'upload.jpg');
  
    try {
      const res = await axios.post(`${Config.base_url}uploadImg`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };
  
  
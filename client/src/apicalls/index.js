import axios from 'axios'


export const axiosInstance= async(
    method,endpoint,payload
)=>{
    try {
        const response= await axios({
            method,
            url:endpoint,
            data:payload,
            headers:{
                authorization:`Bearer ${localStorage.getItem("token")}`  //use Authorization in case authorization not works
            }
        },
        )
        return response.data;
    } catch (error) {
        return error
    }
}
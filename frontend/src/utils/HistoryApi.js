import axios from "axios";

const BASE_URL="http://localhost:8000/api/history";

export const getReviewHistory=async()=>{
        const token=localStorage.getItem("token");
        
        const response=await axios.get(
            `${BASE_URL}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        return response.data;

}

export const getReviewStats = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${BASE_URL}/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const clearReviewHistory = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${BASE_URL}/delete`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

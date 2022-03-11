// async function getUnis() {
//   await fetch("https://jsonplaceholder.typicode.com/users/1")
//     .then((res) => res.json())
//     .then((uni) => {
//       return uni;
//     })
//     .catch((error) => console.log(error));
// }
import axios from "axios";

const renderCollegeList = async (name) => {
  const response = await axios.get(`http://universities.hipolabs.com/search`, {
    params: { name },
  });
  return response;
};

export const universities = renderCollegeList("university");

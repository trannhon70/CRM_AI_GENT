import instance from "../helper/api.helper";

export const fanPagesAPI = {
    create,

};

async function create(body: any) {
    const respone = await instance.post("/fanpages", body);
    return respone.data
}
export const fetchRandomData = async () => {
    return fetch(`https://cnodejs.org/api/v1/topics/`,{ mode: "cors"}).then(data=>data.json());
}

export const detailsdata = async (id) => {
    return fetch(`https://cnodejs.org/api/v1/topic/${id}`,{ mode: "cors"}).then(data=>data.json());
}

window.fetchRandomData = fetchRandomData;
window.detailsdata = detailsdata;
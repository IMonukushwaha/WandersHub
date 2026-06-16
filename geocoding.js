const axios = require('axios');

module.exports.geocode = async (address)=>{
  try {
    const response = await axios.get('https://photon.komoot.io/api/', {
      params: {
        q: address,
        limit: 1
      }
    });

    const feature = response.data.features[0];
    if (!feature) {
      console.log("Not found");
      return null;
    }

    const [lng, lat] = feature.geometry.coordinates;
    const name = feature.properties.name;

    console.log({ lat, lng, name });
    return {lng, lat};

  } catch (err) {
    console.error("Error:", err.message);
  }
}
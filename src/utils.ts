import axios from "axios";

export const formatAddress = async (address) => {
    const { data } = await axios.get(process.env.GOOGLE_API_URL, {
        params: {
            address: address,
            key: process.env.GOOGLE_API_KEY
        }
    })

    return {
        address: data.results[0]['formatted_address'],
        ...data.results[0].geometry,
    };
}

export const getCombinations = (data) => {
    let results = [];
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            results.push({
                addresses: [data[i].address, data[j].address],
                locations: [
                    { ...data[i].location },
                    { ...data[j].location }
                ]
            });
        }
    }
    return results
}

export const orderAddresses = (addresses) => {
    const formattedAddresses = addresses.map((address) => ({
        from: address.addresses[0],
        to: address.addresses[1],
        distance: calculateEuclideanDistance(address.locations[0], address.locations[1])
    }))

    return formattedAddresses.sort((a, b) => a.distance - b.distance)
}

export const calculateEuclideanDistance = (firstLocation, secondLocation) => {
    const deltaX = firstLocation.lat - secondLocation.lat;
    const deltaY = firstLocation.lng - secondLocation.lng;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}


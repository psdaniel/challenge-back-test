import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const validateField = (data) => {
  const { addresses } = data;

  if (addresses.length === 0) throw new Error();
}

const validationPost = (req, res, next) => {
  try {
    validateField(req.body);
    next();
  } catch (err) {
    return res.status(400).send({ message: 'Invalid request' });
  }
};

const formatAddress = async (address) => {
  const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
    params: {
      address: address,
      key: 'AIzaSyARFOqqpx3EF3tx4xuxGYplUKeDsz3uIn8'
    }
  })
  return {
    address: data.results[0]['formatted_address'],
    ...data.results[0].geometry,
  };
}

function getCombinations(data) {
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

const calculateEuclideanDistance = (firstLocation, secondLocation) => {
  const deltaX = firstLocation.lat - secondLocation.lat;
  const deltaY = firstLocation.lng - secondLocation.lng;

  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

const orderAddresses = (addresses) => {
  const formattedAddresses = addresses.map((address) => ({
    from: address.addresses[0],
    to: address.addresses[1],
    distance: calculateEuclideanDistance(address.locations[0], address.locations[1])
  }))

  return formattedAddresses.sort((a, b) => a.distance - b.distance)
}

app.post('/api/addresses', validationPost, async (req, res) => {
  const data = await Promise.all(req.body.addresses.map(address => formatAddress(address)));

  const pairsOfLocations = getCombinations(data)

  const orderedLocationsByDistance = orderAddresses(pairsOfLocations);

  return res.json({
    all: orderedLocationsByDistance,
    closest: { ...orderedLocationsByDistance[0] },
    longest: { ...orderedLocationsByDistance[orderedLocationsByDistance.length - 1] }
  })
});

app.listen(3333);

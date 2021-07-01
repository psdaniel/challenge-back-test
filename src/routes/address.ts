import { Router, RouterOptions } from 'express';
import { validateBody } from '../middlewares/validate-body';
import { formatAddress, getCombinations, orderAddresses } from '../utils';

const router = Router();

router.post('/api/addresses', validateBody, async (req, res) => {
    const data = await Promise.all(req.body.addresses.map(address => formatAddress(address)));

    const pairsOfLocations = getCombinations(data)

    const orderedLocationsByDistance = orderAddresses(pairsOfLocations);

    return res.json({
        all: orderedLocationsByDistance,
        closest: { ...orderedLocationsByDistance[0] },
        longest: { ...orderedLocationsByDistance[orderedLocationsByDistance.length - 1] }
    })
});

export { router as addressRoutes };
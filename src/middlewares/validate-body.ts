export const validateBody = (req, res, next) => {
    const { addresses } = req.body;
    try {
        if (addresses.length === 0) throw new Error();
        next();
    } catch (err) {
        return res.status(400).send({ message: 'Invalid request' });
    }
};

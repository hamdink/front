export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const calculatePrice = async (market, client, products) => {
    try {
        const marketCoords = {
            latitude: market.latitude,
            longitude: market.longitude
        };
        const clientCoords = {
            latitude: client.latitude,
            longitude: client.longitude
        };

        const distance = calculateDistance(
            parseFloat(marketCoords.latitude),
            parseFloat(marketCoords.longitude),
            parseFloat(clientCoords.latitude),
            parseFloat(clientCoords.longitude)
        );

        let priceAdjustment = 0;
        if (distance > 30) {
            priceAdjustment = (distance - 30) * 2;
        }

        let productTotalPrice = 0;
        products.forEach(product => {
            if (product.price) {
                productTotalPrice += product.price * product.quantity;
            }
        });

        const deliveryFee = priceAdjustment;
        const finalPrice = productTotalPrice + deliveryFee;

        return finalPrice.toFixed(2);
    } catch (error) {
        throw new Error('Error calculating price: ' + error.message);
    }
};

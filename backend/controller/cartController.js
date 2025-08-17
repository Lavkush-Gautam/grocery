import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
        const { userId, cartItem } = req.body;
        await User.findByIdAndUpdate(userId, { cartItem })
        res.json({ success: true, message: 'Cart Updated' })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }

}
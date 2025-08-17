import jwt from 'jsonwebtoken'

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.status(200).json({ success: true, message: 'Login successful.' });
        }

        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
};

export const sellerIsAuth = async (req, res) => {
    try {
        const token = req.cookies.sellerToken;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authenticated.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid token.' });
            }
            return res.status(200).json({ success: true, message: 'User authenticated', user: decoded });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
};

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({ success: true, message: 'Logged out.' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
};

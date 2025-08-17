import Address from '../models/address.js'
export const addAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // assuming authentication middleware injected this
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { address } = req.body;
    await Address.create({ ...address, userId });

    return res.status(201).json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.error('AddAddress error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const getAddress=async(req,res)=>{
    try {
        const userId = req.user?.id;

        const addresses=await Address.find({userId})
   
        res.json({success:true,addresses});
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}